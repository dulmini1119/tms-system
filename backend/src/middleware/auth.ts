// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { ERROR_CODES, HTTP_STATUS } from '../utils/constants';
import ApiResponse from '../utils/response';
import prisma from '../config/database';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    department_id?: string;
    business_unit_id?: string;
    manager_id?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return ApiResponse.error(res, ERROR_CODES.UNAUTHORIZED, 'No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    // Try access token first
    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        const user = await prisma.users.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            department_id: true,
            business_unit_id: true,
            manager_id: true,
            status: true,
          },
        });

        if (user && user.status === 'Active') {
          req.user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            department_id: user.department_id || undefined,
            business_unit_id: user.business_unit_id || undefined,
            manager_id: user.manager_id || undefined,
          };
          return next();
        }
      } catch (error: any) {
        if (error.name !== 'TokenExpiredError') {
          logger.warn('Invalid access token');
        }
        // Continue to try refresh token
      }
    }

    // If access token missing or expired → try refresh token
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await prisma.users.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, status: true },
        });

        if (!user || user.status !== 'Active') {
          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');
          return ApiResponse.error(res, ERROR_CODES.UNAUTHORIZED, 'Invalid session', HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user.id); // implement this

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000,
        });

        req.user = { id: user.id, email: user.email };
        return next();
      } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return ApiResponse.error(res, ERROR_CODES.UNAUTHORIZED, 'Session expired', HTTP_STATUS.UNAUTHORIZED);
      }
    }

    return ApiResponse.error(res, ERROR_CODES.UNAUTHORIZED, 'Authentication failed', HTTP_STATUS.UNAUTHORIZED);
  } catch (error) {
    logger.error('Authentication error:', error);
    return ApiResponse.error(res, ERROR_CODES.INTERNAL_ERROR, 'Server error', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

  // Add this at the end of src/middleware/auth.ts
const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    logger.error('JWT_ACCESS_SECRET is missing in environment');
    throw new Error('Server configuration error');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '15m' });
};