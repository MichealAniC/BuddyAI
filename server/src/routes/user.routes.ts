import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { listStudents, getStudent } from '../controllers/user.controller';

const router = Router();

router.use(authenticate, requireRole('COUNSELLOR'));
router.get('/students', listStudents);
router.get('/students/:id', getStudent);

export default router;
