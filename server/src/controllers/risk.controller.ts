import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { evaluateRisk, getLatestRiskEvaluation } from '../services/risk.service';

export async function evaluate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const result = await evaluateRisk(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getLatest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const result = await getLatestRiskEvaluation(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
