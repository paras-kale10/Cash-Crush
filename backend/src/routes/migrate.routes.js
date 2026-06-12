import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { migrateLocalSchema } from '../validators/schemas.js';
import * as migrateController from '../controllers/migrate.controller.js';

const router = Router();

router.use(authenticate);
router.post('/local-storage', validate(migrateLocalSchema), migrateController.migrateFromLocal);

export default router;
