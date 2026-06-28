import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as analyticsService from '../services/analytics.service';

export async function getSnapshot(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const snapshot = await analyticsService.getSystemSnapshot();
    res.status(200).json(snapshot);
  } catch (err) {
    next(err);
  }
}

export async function getReportData(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getReportData();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
