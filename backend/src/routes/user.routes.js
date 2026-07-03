import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/schemas.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.use(authenticate);
router.get('/profile', userController.getProfile);
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/profile/reset', userController.resetProfile);

export default router;
