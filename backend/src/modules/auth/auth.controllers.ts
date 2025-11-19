import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from './auth.service';
import ApiResponse from '../../utils/response';
import { HTTP_STATUS } from '../../utils/constants';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login
   */
  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Register
   */
  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      ApiResponse.created(res, { user }, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh Token
   */
  refreshToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout
   */
  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);

      ApiResponse.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change Password
   */
  changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!req.user) throw new Error('User not authenticated');

      const result = await this.authService.changePassword(req.user.id, currentPassword, newPassword);
      ApiResponse.success(res, result, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get Current User
   */
  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const user = await this.authService.getCurrentUser(req.user.id);
      ApiResponse.success(res, { user }, 'Current user fetched successfully');
    } catch (error) {
      next(error);
    }
  };
}
