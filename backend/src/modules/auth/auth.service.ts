import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '../../utils/constants';
import logger from '../../utils/logger';

const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED,
        'Your account is not active. Please contact administrator.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        organization: user.organization,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 hour in seconds
      },
    };
  }

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    organizationId?: string;
    employeeId?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(
        ERROR_CODES.ALREADY_EXISTS,
        'User with this email already exists',
        HTTP_STATUS.CONFLICT
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        organizationId: data.organizationId,
        employeeId: data.employeeId,
        status: 'ACTIVE',
        permissions: this.getDefaultPermissions(data.role),
      },
      include: {
        organization: true,
      },
    });

    logger.info(`New user registered: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'Invalid refresh token',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Check if token is expired
      if (new Date() > storedToken.expiresAt) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { token: refreshToken },
        });

        throw new AppError(
          ERROR_CODES.TOKEN_EXPIRED,
          'Refresh token has expired',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'User not found or inactive',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        accessToken,
        expiresIn: 3600,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.UNAUTHORIZED,
        'Invalid refresh token',
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string) {
    try {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      logger.info('User logged out successfully');
    } catch (error) {
      // Token might not exist, but that's okay
      logger.debug('Logout: Token not found in database');
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(
        ERROR_CODES.INVALID_CREDENTIALS,
        'Current password is incorrect',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Delete all refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info(`Password changed for user: ${user.email}`);

    return { message: 'Password changed successfully' };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        organizationId: true,
        employeeId: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        profileImage: true,
        permissions: true,
        lastLoginAt: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            code: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Get default permissions based on role
   */
  private getDefaultPermissions(role: string): any {
    const permissions: { [key: string]: string[] } = {
      ADMIN: ['*'], // All permissions
      FLEET_MANAGER: [
        'USER_READ',
        'ORG_READ',
        'VEHICLE_READ',
        'VEHICLE_WRITE',
        'TRIP_READ',
        'TRIP_WRITE',
        'BILLING_READ',
      ],
      DRIVER: ['TRIP_READ', 'TRIP_WRITE', 'VEHICLE_READ'],
      FINANCE: [
        'USER_READ',
        'TRIP_READ',
        'BILLING_READ',
        'BILLING_WRITE',
      ],
      VIEWER: [
        'USER_READ',
        'ORG_READ',
        'VEHICLE_READ',
        'TRIP_READ',
        'BILLING_READ',
      ],
    };

    return permissions[role] || [];
  }
}
