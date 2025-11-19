import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';

const router = Router();
const usersController = new UsersController();

// All routes require authentication
router.use(authMiddleware);

// GET /users - Get all users with pagination and filters
router.get('/', usersController.getUsers);

// GET /users/:id - Get user by ID
router.get('/:id', usersController.getUserById);

// POST /users - Create new user
router.post('/', usersController.createUser);

// PUT /users/:id - Update user
router.put('/:id', usersController.updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', usersController.deleteUser);

// GET /users/:id/permissions - Get user permissions
router.get('/:id/permissions', usersController.getUserPermissions);

// PUT /users/:id/permissions - Update user permissions
router.put('/:id/permissions', usersController.updateUserPermissions);

export default router;
