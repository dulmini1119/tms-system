import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { UsersService } from './users.service';
import ApiResponse from '../../utils/response';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * Get all users
   */
  getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;

      const result = await this.usersService.getUsers(filters);

      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   */
  getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this.usersService.getUserById(userId);

      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create user
   */
  createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);

      ApiResponse.created(res, { user }, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user
   */
  updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this.usersService.updateUser(userId, req.body);

      ApiResponse.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user
   */
  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const result = await this.usersService.deleteUser(userId);

      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user permissions
   */
  getUserPermissions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const result = await this.usersService.getUserPermissions(userId);

      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user permissions
   */
  updateUserPermissions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { permissions } = req.body;

      const result = await this.usersService.updateUserPermissions(userId, permissions);

      ApiResponse.success(res, result, 'Permissions updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
