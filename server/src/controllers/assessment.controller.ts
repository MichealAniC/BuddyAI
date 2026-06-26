import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as assessmentService from '../services/assessment.service';

export async function submit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { responses } = req.body;

    if (
      !Array.isArray(responses) ||
      responses.length !== 9 ||
      !responses.every((r: unknown) => typeof r === 'number' && Number.isInteger(r) && r >= 0 && r <= 3)
    ) {
      res.status(400).json({ error: 'responses must be an array of exactly 9 numbers, each between 0 and 3.' });
      return;
    }

    const assessment = await assessmentService.submitAssessment(req.user.id, responses as number[]);

    // Generate recommendation for counsellors when severity is moderate or higher
    if (['MODERATE', 'MODERATELY_SEVERE', 'SEVERE'].includes(assessment.severityLevel)) {
      await assessmentService.generateRecommendation(assessment);
    }

    res.status(201).json(assessment);
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

    const assessments = await assessmentService.getAssessmentHistory(req.user.id);
    res.status(200).json(assessments);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid assessment ID.' });
      return;
    }

    const assessment = await assessmentService.getAssessmentById(id, req.user.id);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found.' });
      return;
    }

    res.status(200).json(assessment);
  } catch (err) {
    next(err);
  }
}
