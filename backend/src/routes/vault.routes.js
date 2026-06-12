import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { vaultUpdateSchema } from '../validators/schemas.js';
import * as vaultController from '../controllers/vault.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', vaultController.get);
router.patch('/', validate(vaultUpdateSchema), vaultController.update);

export default router;
