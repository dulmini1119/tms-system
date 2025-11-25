import bcrypt from "bcrypt";
import prisma from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { ERROR_CODES, HTTP_STATUS } from "../../utils/constants";
import logger from "../../utils/logger";

const SALT_ROUNDS = 10;

export class UsersService {
  /**
   * Get all users with optional filters and pagination
   */
  async getUsers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    organizationId?: string;
    sortBy?: "created_at" | "first_name" | "last_name" | "email";
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      organizationId,
      sortBy = "created_at",
      sortOrder = "desc",
    } = filters;

    const where: any = { deleted_at: null };
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { first_name: { contains: search, mode: "insensitive" } },
        { last_name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (organizationId) where.business_unit_id = organizationId;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          employee_id: true,
          status: true,
          created_at: true,
          updated_at: true,
          user_roles_user_roles_user_idTousers: {
            select: {
              roles: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.users.count({ where }),
    ]);

    // Map roles
    const cleanUsers = users.map((u) => ({
      ...u,
      roles: u.user_roles_user_roles_user_idTousers.map((ur) => ur.roles.name),
    }));

    return {
      users: cleanUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        user_roles_user_roles_user_idTousers: {
          include: { roles: true },
        },
      },
    });

    if (!user) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        "User not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    const { user_roles_user_roles_user_idTousers, ...userData } = user;

    return {
      ...userData,
      roles: user_roles_user_roles_user_idTousers.map((ur) => ur.roles.name),
    };
  }

  /**
   * Create new user
   */
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    organizationId?: string;
    employeeId: string;
  }) {
    if (!data.employeeId) {
      throw new AppError(
        ERROR_CODES.BAD_REQUEST,
        "Employee ID is required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const email = data.email.toLowerCase();

    const [existingUser, existingEmployee] = await Promise.all([
      prisma.users.findUnique({ where: { email } }),
      prisma.users.findUnique({ where: { employee_id: data.employeeId } }),
    ]);

    if (existingUser) {
      throw new AppError(
        ERROR_CODES.ALREADY_EXISTS,
        "User with this email already exists",
        HTTP_STATUS.CONFLICT
      );
    }

    if (existingEmployee) {
      throw new AppError(
        ERROR_CODES.ALREADY_EXISTS,
        "Employee ID already exists",
        HTTP_STATUS.CONFLICT
      );
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.users.create({
      data: {
        email,
        password_hash,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        employee_id: data.employeeId,
        business_unit_id: data.organizationId,
        status: "Active",
      },
    });

    logger.info(`User created: ${user.email}`);

    const { password_hash: _, ...cleanUser } = user;
    return cleanUser;
  }

  /**
   * Update user
   */
  async updateUser(
    userId: string,
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      status: string;
      employeeId: string;
    }>
  ) {
    const existingUser = await this.getUserById(userId);

    if (data.email && data.email.toLowerCase() !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (emailExists) {
        throw new AppError(
          ERROR_CODES.ALREADY_EXISTS,
          "Email already in use",
          HTTP_STATUS.CONFLICT
        );
      }
    }

    if (data.employeeId && data.employeeId !== existingUser.employee_id) {
      const employeeExists = await prisma.users.findUnique({
        where: { employee_id: data.employeeId },
      });
      if (employeeExists) {
        throw new AppError(
          ERROR_CODES.ALREADY_EXISTS,
          "Employee ID already in use",
          HTTP_STATUS.CONFLICT
        );
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...data,
        email: data.email?.toLowerCase(),
        first_name: data.firstName,
        last_name: data.lastName,
        employee_id: data.employeeId,
      },
    });

    const { password_hash: _, ...cleanUser } = updatedUser;
    return cleanUser;
  }

  /**
   * Soft delete user
   */
  async deleteUser(userId: string) {
    await this.getUserById(userId);

    await prisma.users.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });

    logger.info(`User soft deleted: ${userId}`);
    return { message: "User deleted successfully" };
  }
}
