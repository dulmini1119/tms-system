import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { PermissionsController } from './permission.controllers';
import { validateBody } from '../../middleware/validation';
import { saveRolePermissionsSchema } from './permission.validation';

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