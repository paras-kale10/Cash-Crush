import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transactionRoutes from './transaction.routes.js';
import goalRoutes from './goal.routes.js';
import vaultRoutes from './vault.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import migrateRoutes from './migrate.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/goals', goalRoutes);
router.use('/vault', vaultRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/migrate', migrateRoutes);

export default router;
