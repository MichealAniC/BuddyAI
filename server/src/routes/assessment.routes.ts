import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { submit, getHistory, getById } from '../controllers/assessment.controller';

const router = Router();

router.post('/phq9', authenticate, submit);
router.get('/phq9', authenticate, getHistory);
router.get('/phq9/:id', authenticate, getById);

export default router;
