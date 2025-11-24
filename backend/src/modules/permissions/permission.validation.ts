import Joi from 'joi';

// Save permissions for a role
export const saveRolePermissionsSchema = Joi.object({
  roleId: Joi.string()
    .uuid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.guid': 'Role ID must be a valid UUID',
      'any.required': 'Role ID is required',
    }),

  permissionIds: Joi.array()
    .items(
      Joi.string()
        .uuid({ version: ['uuidv4'] })
        .message('Each permission ID must be a valid UUID')
    )
    .required()
    .min(0)
    .messages({
      'array.base': 'Permission IDs must be an array',
      'any.required': 'Permission IDs are required',
    }),
});

// Optional: If you ever want to update a single permission
export const updatePermissionSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  code: Joi.string()
    .pattern(/^[a-z_]+$/)
    .message('Code must contain only lowercase letters and underscores'),
  category: Joi.string().allow('').optional(),
});