import prisma from '../../config/database.js';

export class PermissionsService {
  // Get everything needed for the permissions matrix
  async getAllWithRoleAssignments() {
    const [permissions, rolePermissions, roles] = await Promise.all([
      prisma.permissions.findMany({
        select: {
          id: true,
          code: true,
          name: true,
        },
        orderBy: {  name: 'asc' },
      }),
      prisma.role_permissions.findMany({
        select: {
          role_id: true,
          permission_id: true,
        },
      }),
      prisma.roles.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    // Build map: roleId → array of permissionIds
    const roleMap = rolePermissions.reduce((acc, rp) => {
      if (!acc[rp.role_id]) acc[rp.role_id] = [];
      acc[rp.role_id].push(rp.permission_id);
      return acc;
    }, {} as Record<string, string[]>);

    return {
      permissions,
      roles,
      roleMap,
    };
  }

  // Save permissions for one role
  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    await prisma.$transaction(async (tx) => {
      // Delete old permissions
      await tx.role_permissions.deleteMany({
        where: { role_id: roleId },
      });

      // Insert new ones
      if (permissionIds.length > 0) {
        await tx.role_permissions.createMany({
          data: permissionIds.map((permission_id) => ({
            role_id: roleId,
            permission_id,
          })),
        });
      }
    });
  }
}