import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { getDashboardStats } from '../services/dashboard.service';

export async function getStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
