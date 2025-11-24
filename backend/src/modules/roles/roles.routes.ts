import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { RolesController } from './roles.controllers';
import { validateBody } from '../../middleware/validation';
import {
  createRoleSchema,
  updateRoleSchema,
} from './roles.validation';

const router = Router();
const controller = new RolesController();

router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.post('/', authenticate, validateBody(createRoleSchema), controller.create.bind(controller));
router.put('/:id', authenticate, validateBody(updateRoleSchema), controller.update.bind(controller));
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
