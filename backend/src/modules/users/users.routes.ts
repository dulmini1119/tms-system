import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { validateQuery } from '../../middleware/validation';

const router = Router();
const usersController = new UsersController();

// All routes require authentication
router.use(authenticate);

// GET /users - Get all users with pagination and filters
router.get('/', usersController.getUsers.bind(usersController));

// GET /users/:id - Get user by ID
router.get('/:id', usersController.getUserById.bind(usersController));

// POST /users - Create new user
router.post('/', validateQuery, usersController.createUser.bind(usersController));

// PUT /users/:id - Update user
router.put('/:id', validateQuery, usersController.updateUser.bind(usersController));

// DELETE /users/:id - Delete user
router.delete('/:id', usersController.deleteUser.bind(usersController));



export default router;
