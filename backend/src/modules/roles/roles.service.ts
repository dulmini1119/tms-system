import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { ERROR_CODES, HTTP_STATUS } from '../../utils/constants';

export class RolesService {
  async getAll() {
    return await prisma.roles.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: { user_roles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const role = await prisma.roles.findUnique({
      where: { id },
      include: {
        role_permissions: {
          include: { permissions: { select: { name: true, code: true } } },
        },
      },
    });

    if (!role) throw new AppError(ERROR_CODES.NOT_FOUND, 'Role not found', HTTP_STATUS.NOT_FOUND);
    return role;
  }

  async create(data: { name: string; description?: string }) {
    const exists = await prisma.roles.findUnique({ where: { name: data.name } });
    if (exists) throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Role name already exists', HTTP_STATUS.CONFLICT);

    return await prisma.roles.create({
      data: {
        name: data.name,
        description: data.description || null,
        code: data.name.toUpperCase().replace(/\s+/g, '_'),
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    await this.getById(id); // ensures exists

    if (data.name) {
      const exists = await prisma.roles.findUnique({ where: { name: data.name } });
      if (exists && exists.id !== id) {
        throw new AppError(ERROR_CODES.ALREADY_EXISTS, 'Role name already exists', HTTP_STATUS.CONFLICT);
      }
    }

    return await prisma.roles.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.getById(id);

    // Prevent deleting roles with users
    const userCount = await prisma.user_roles.count({ where: { role_id: id } });
    if (userCount > 0) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cannot delete role with assigned users', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.roles.delete({ where: { id } });
  }
}