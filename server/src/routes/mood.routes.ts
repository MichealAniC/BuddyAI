import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { recordMood, getHistory, getTrends } from '../controllers/mood.controller';

const router = Router();

router.post('/', authenticate, recordMood);
router.get('/', authenticate, getHistory);
router.get('/trends', authenticate, getTrends);

export default router;
