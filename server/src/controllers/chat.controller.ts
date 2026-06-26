import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as chatService from '../services/chat.service';

export async function createConversation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const conversation = await chatService.createConversation(req.user.id);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function getConversations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const conversations = await chatService.getUserConversations(req.user.id);
    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const conversationId = parseInt(req.params.id as string, 10);
    const { messageText } = req.body;

    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      res.status(400).json({ error: 'messageText is required and must be a non-empty string.' });
      return;
    }

    const result = await chatService.sendMessage(conversationId, req.user.id, messageText.trim());
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const conversationId = parseInt(req.params.id as string, 10);
    const messages = await chatService.getConversationMessages(conversationId, req.user.id);
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
}
