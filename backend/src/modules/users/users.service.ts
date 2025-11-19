import bcrypt from 'bcrypt';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '../../utils/constants';
import logger from '../../utils/logger';

const SALT_ROUNDS = 10;

export class UsersService {
  async getUsers(filters: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
    organizationId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { page, limit, search, role, status, organizationId, sortBy, sortOrder } = filters;

    const where: any = {
      deleted_at: null,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organization_id = organizationId;
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          role: true,
          status: true,
          organization_id: true,
          employee_id: true,
          last_login: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.users.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: string;
    organization_id?: string;
    employee_id?: string;
  }) {
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    if (data.employee_id) {
      const existingEmployee = await prisma.users.findUnique({
        where: { employee_id: data.employee_id },
      });

      if (existingEmployee) {
        throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Employee ID already exists', HTTP_STATUS.CONFLICT);
      }
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.users.create({
      data: {
        email: data.email.toLowerCase(),
        password_hash,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        role: data.role,
        organization_id: data.organization_id,
        employee_id: data.employee_id,
        status: 'Active',
      },
    });

    logger.info(`User created: ${user.email}`);
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: string, data: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    status: string;
    organization_id: string;
    employee_id: string;
  }>) {
    const existingUser = await this.getUserById(userId);

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (emailExists) {
        throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Email already in use', HTTP_STATUS.CONFLICT);
      }
    }

    if (data.employee_id && data.employee_id !== existingUser.employee_id) {
      const employeeExists = await prisma.users.findUnique({
        where: { employee_id: data.employee_id },
      });
      if (employeeExists) {
        throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Employee ID already in use', HTTP_STATUS.CONFLICT);
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...data,
        email: data.email?.toLowerCase(),
      },
    });

    const { password_hash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: string) {
    await this.getUserById(userId);

    await prisma.users.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });

    logger.info(`User soft deleted: ${userId}`);
    return { message: 'User deleted successfully' };
  }

  async getUserPermissions(userId: string) {
    const user = await this.getUserById(userId);
    return { permissions: Array.isArray(user.permissions) ? user.permissions : [] };
  }

  async updateUserPermissions(userId: string, permissions: string[]) {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { permissions },
    });

    return { permissions: Array.isArray(updatedUser.permissions) ? updatedUser.permissions : [] };
  }
}
