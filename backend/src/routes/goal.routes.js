import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { goalSchema, updateGoalSchema, goalIdSchema } from '../validators/schemas.js';
import * as goalController from '../controllers/goal.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', goalController.list);
router.post('/', validate(goalSchema), goalController.create);
router.patch('/:id', validate(updateGoalSchema), goalController.update);
router.delete('/:id', validate(goalIdSchema), goalController.remove);

export default router;
