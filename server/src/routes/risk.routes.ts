import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { evaluate, getLatest } from '../controllers/risk.controller';

const router = Router();

router.post('/evaluate', authenticate, evaluate);
router.get('/latest', authenticate, getLatest);

export default router;
