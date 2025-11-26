import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { UsersService } from "./users.service.js";
import ApiResponse from "../../utils/response.js";
import prisma from "../../config/database.js";

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const filters = req.query as any;
      const result = await this.usersService.getUsers(filters);
      return ApiResponse.success(res, {
      users: result.users,
      pagination: result.pagination
    });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const user = await this.usersService.getUserById(userId);
      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // THIS LINE IS THE FINAL FIX — prevents double response crash
    if (res.headersSent) return;

    try {
      const {
        email,
        password,
        first_name,
        last_name,
        phone,
        employee_id,
        position,
      } = req.body;

      if (
        !email ||
        !password ||
        !first_name ||
        !last_name ||
        !employee_id ||
        !position
      ) {
        return ApiResponse.error(
          res,
          "VALIDATION_ERROR",
          "Missing required fields",
          400
        );
      }

      const mapped = {
        email,
        password,
        firstName: first_name,
        lastName: last_name,
        phone: phone || null,
        employeeId: employee_id,
      };

      const user = await this.usersService.createUser(mapped);

      // Assign role
      const role = await prisma.roles.findUnique({ where: { code: position } });
      if (!role) {
        return ApiResponse.error(res, "ROLE_NOT_FOUND", "Invalid role", 400);
      }

      await (prisma as any).user_roles_user_roles_user_idTousers.create({
        data: { user_id: user.id, role_id: role.id },
      });

      const safeUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        employee_id: user.employee_id,
        status: user.status,
        position: role.name,
      };

      return ApiResponse.created(res, { user: safeUser });
    } catch (error: any) {
      // This will now go through your perfect errorHandler → always JSON
      next(error);
    }
  };

  updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const user = await this.usersService.updateUser(userId, req.body);
      ApiResponse.success(res, { user }, "User updated successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const result = await this.usersService.deleteUser(userId);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
