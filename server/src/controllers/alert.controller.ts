import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { getAlerts, getAlertById, updateAlertStatus, getStudentSummary } from '../services/alert.service';

const VALID_STATUSES = ['PENDING', 'UNDER_REVIEW', 'FOLLOW_UP_SCHEDULED', 'RESOLVED'];

export async function listAlerts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, riskLevel } = req.query;
    const alerts = await getAlerts({
      status: status as string | undefined,
      riskLevel: riskLevel as string | undefined,
    });
    res.status(200).json(alerts);
  } catch (err) {
    next(err);
  }
}

export async function getAlert(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const alert = await getAlertById(id);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found.' });
      return;
    }
    res.status(200).json(alert);
  } catch (err) {
    next(err);
  }
}

export async function updateAlert(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { status, notes, followUpDate } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.` });
      return;
    }

    const alert = await getAlertById(id);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found.' });
      return;
    }

    const updated = await updateAlertStatus(id, { status, notes, followUpDate });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function studentSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const alert = await getAlertById(id);
    if (!alert) {
      res.status(404).json({ error: 'Alert not found.' });
      return;
    }

    const summary = await getStudentSummary(alert.userId);
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}