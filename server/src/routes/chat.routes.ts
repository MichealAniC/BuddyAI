import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createConversation, getConversations, sendMessage, getMessages } from '../controllers/chat.controller';

const router = Router();

router.post('/', authenticate, createConversation);
router.get('/', authenticate, getConversations);
router.post('/:id/messages', authenticate, sendMessage);
router.get('/:id/messages', authenticate, getMessages);

export default router;
