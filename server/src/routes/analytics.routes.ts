import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getSnapshot, getReportData } from '../controllers/analytics.controller';

const router = Router();

router.use(authenticate, requireRole('COUNSELLOR'));

router.get('/snapshot', getSnapshot);
router.get('/report-data', getReportData);

export default router;
