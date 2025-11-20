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
    departmentId?: string;
    businessUnitId?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { page, limit, search, role, status, departmentId, businessUnitId, sortBy, sortOrder } = filters;

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

    // Note: Role filtering is complex with relations; may need separate query or adjustment

    if (status) {
      where.status = status;
    }

    if (departmentId) {
      where.department_id = departmentId;
    }

    if (businessUnitId) {
      where.business_unit_id = businessUnitId;
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
          status: true,
          department_id: true,
          business_unit_id: true,
          employee_id: true,
          position: true,
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
    department_id?: string;
    business_unit_id?: string;
    position?: string;
    employee_id: string;
  }) {
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    const existingEmployee = await prisma.users.findUnique({
      where: { employee_id: data.employee_id },
    });

    if (existingEmployee) {
      throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Employee ID already exists', HTTP_STATUS.CONFLICT);
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.users.create({
      data: {
        email: data.email.toLowerCase(),
        password_hash,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        department_id: data.department_id,
        business_unit_id: data.business_unit_id,
        position: data.position,
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
    status: string;
    department_id: string;
    business_unit_id: string;
    position: string;
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
    const userWithRoles = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            roles: {
              include: {
                role_permissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithRoles) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    const permissions = userWithRoles.user_roles.flatMap((userRole: any) =>
      userRole.roles.role_permissions.map((rp: any) => rp.permissions.code)
    );

    return { permissions: [...new Set(permissions)] };
  }

  async assignUserRole(userId: string, roleId: string) {
    await this.getUserById(userId);

    const roleExists = await prisma.roles.findUnique({
      where: { id: roleId },
    });

    if (!roleExists) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Role not found', HTTP_STATUS.NOT_FOUND);
    }

    const existingRole = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: userId,
          role_id: roleId,
        },
      },
    });

    if (existingRole) {
      throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'User already has this role', HTTP_STATUS.CONFLICT);
    }

    await prisma.user_roles.create({
      data: {
        user_id: userId,
        role_id: roleId,
      },
    });

    return { message: 'Role assigned successfully' };
  }

  async removeUserRole(userId: string, roleId: string) {
    await this.getUserById(userId);

    const deletedRole = await prisma.user_roles.deleteMany({
      where: {
        user_id: userId,
        role_id: roleId,
      },
    });

    if (deletedRole.count === 0) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'User does not have this role', HTTP_STATUS.NOT_FOUND);
    }

    return { message: 'Role removed successfully' };
  }
}
