import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getStats } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate, requireRole('COUNSELLOR'));
router.get('/stats', getStats);

export default router;
