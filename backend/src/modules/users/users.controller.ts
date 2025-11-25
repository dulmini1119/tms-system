import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { UsersService } from './users.service';
import ApiResponse from '../../utils/response';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as any;
      const result = await this.usersService.getUsers(filters);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const user = await this.usersService.getUserById(userId);
      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);
      ApiResponse.created(res, { user }, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const user = await this.usersService.updateUser(userId, req.body);
      ApiResponse.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const result = await this.usersService.deleteUser(userId);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
