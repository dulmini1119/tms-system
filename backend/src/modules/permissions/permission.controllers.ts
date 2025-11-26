import { Request, Response, NextFunction } from 'express';
import { PermissionsService } from './permission.service.js';
import ApiResponse from '../../utils/response.js';

export class PermissionsController {
  private service = new PermissionsService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllWithRoleAssignments();
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  };

  save = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleId, permissionIds } = req.body;
      await this.service.updateRolePermissions(roleId, permissionIds);
      ApiResponse.success(res, { message: 'Permissions saved' });
    } catch (error) {
      next(error);
    }
  };
}