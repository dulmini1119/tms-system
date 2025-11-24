import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '../../utils/constants';
import bcrypt from 'bcrypt';
import ApiResponse from '../../utils/response';

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  email: string;
  otp: string;
  newPassword: string;
}

export class AuthController {
  // ... your other methods ...

  forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;

      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Email not found', HTTP_STATUS.NOT_FOUND);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await prisma.passwordReset.create({
        data: { email, token: otp, expires_at: expires }
      });

      console.log(`OTP for ${email}: ${otp}`); // Remove later

      ApiResponse.success(res, {}, 'OTP sent to email');
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request<{}, {}, ResetPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, otp, newPassword } = req.body;

      const reset = await prisma.passwordReset.findFirst({
        where: { email, token: otp, expires_at: { gt: new Date() } }
      });

      if (!reset) {
        throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid or expired OTP', HTTP_STATUS.UNAUTHORIZED);
      }

      const password_hash = await bcrypt.hash(newPassword, 10);
      await prisma.users.update({ where: { email }, data: { password_hash } });
      await prisma.passwordReset.delete({ where: { id: reset.id } });

      ApiResponse.success(res, {}, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  };
}