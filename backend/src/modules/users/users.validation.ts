// src/modules/users/users.validation.ts
import Joi from 'joi';

// Note: these values are aligned with your DB/seed values (Option B)
const ROLE_VALUES = ['SUPERADMIN', 'VEHICLEADMIN', 'MANAGER', 'HOD', 'EMPLOYEE', 'DRIVER'] as const;
const STATUS_VALUES = ['Active', 'Inactive', 'Suspended'] as const;

// Create user schema
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().optional().allow(null, ''),
  // accept DB role values
  role: Joi.string().valid(...ROLE_VALUES).required(),
  organizationId: Joi.string().uuid().optional().allow(null),
  employeeId: Joi.string().required(),
  licenseNumber: Joi.string().optional().allow(null, ''),
  licenseExpiry: Joi.date().optional().allow(null),
  address: Joi.object().optional().allow(null),
}).strict();

// Update user schema
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional().allow(null, ''),
  // accept DB role values for updates too
  role: Joi.string().valid(...ROLE_VALUES).optional(),
  // accept DB status values (note capitalization)
  status: Joi.string().valid(...STATUS_VALUES).optional(),
  organizationId: Joi.string().uuid().optional().allow(null),
  employeeId: Joi.string().optional().allow(null, ''),
  licenseNumber: Joi.string().optional().allow(null, ''),
  licenseExpiry: Joi.date().optional().allow(null),
  address: Joi.object().optional().allow(null),
}).strict();

// Query params for get users
export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional().allow('', null),
  // allow DB role values in query
  role: Joi.string().valid(...ROLE_VALUES).optional().allow('', null),
  // allow DB status values in query (notice 'Active' etc)
  status: Joi.string().valid(...STATUS_VALUES).optional().allow('', null),
  organizationId: Joi.string().uuid().optional().allow(null, ''),
  sortBy: Joi.string().valid('created_at', 'first_name', 'last_name', 'email').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
}).strict();
