import Joi from 'joi';

export const createRoleSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Role name can only contain letters, numbers, and spaces',
      'any.required': 'Role name is required',
    }),

  description: Joi.string().max(255).optional().allow(''),
});

export const updateRoleSchema = createRoleSchema.fork(['name'], (schema) => schema.optional());

export type CreateRoleDto = {
  name: string;
  description?: string;
};

export type UpdateRoleDto = Partial<CreateRoleDto>;