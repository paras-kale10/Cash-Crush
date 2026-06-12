import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  transactionSchema,
  updateTransactionSchema,
  transactionIdSchema,
  transactionQuerySchema,
} from '../validators/schemas.js';
import * as transactionController from '../controllers/transaction.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', validate(transactionQuerySchema), transactionController.list);
router.post('/', validate(transactionSchema), transactionController.create);
router.patch('/:id', validate(updateTransactionSchema), transactionController.update);
router.delete('/:id', validate(transactionIdSchema), transactionController.remove);

export default router;
