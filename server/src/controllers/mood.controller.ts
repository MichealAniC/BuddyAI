import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as moodService from '../services/mood.service';

export async function recordMood(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { moodRating, notes } = req.body;

    if (moodRating === undefined || moodRating === null) {
      res.status(400).json({ error: 'moodRating is required.' });
      return;
    }

    if (!Number.isInteger(moodRating) || moodRating < 1 || moodRating > 5) {
      res.status(400).json({ error: 'moodRating must be an integer between 1 and 5.' });
      return;
    }

    if (notes !== undefined && typeof notes !== 'string') {
      res.status(400).json({ error: 'notes must be a string.' });
      return;
    }

    const entry = await moodService.createMoodEntry(req.user.id, moodRating, notes);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const entries = await moodService.getMoodHistory(req.user.id, start, end);
    res.status(200).json(entries);
  } catch (err) {
    next(err);
  }
}

export async function getTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const trends = await moodService.getMoodTrends(req.user.id);
    res.status(200).json(trends);
  } catch (err) {
    next(err);
  }
}
