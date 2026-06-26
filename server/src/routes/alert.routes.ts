import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { listAlerts, getAlert, updateAlert, studentSummary } from '../controllers/alert.controller';

const router = Router();

router.use(authenticate, requireRole('COUNSELLOR'));

router.get('/', listAlerts);
router.get('/:id', getAlert);
router.patch('/:id', updateAlert);
router.get('/:id/student', studentSummary);

export default router;
