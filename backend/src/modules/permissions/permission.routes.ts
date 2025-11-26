import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { PermissionsController } from './permission.controllers.js';
import { validateBody } from '../../middleware/validation.js';
import { saveRolePermissionsSchema } from './permission.validation.js';

const router = Router();
const controller = new PermissionsController();

// Only superadmin can manage permissions
router.get('/', authenticate, controller.getAll);

router.post(
  '/save',
  authenticate,
  // requireRole('superadmin'), // ← Uncomment if you have this middleware
  validateBody(saveRolePermissionsSchema),
  controller.save
);

export default router;