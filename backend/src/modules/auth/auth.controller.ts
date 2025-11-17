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
      const userId = req.user!.id;

      const result = await this.authService.changePassword(userId, currentPassword, newPassword);

      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get Current User
   */
  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      const user = await this.authService.getCurrentUser(userId);

      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  };
}
