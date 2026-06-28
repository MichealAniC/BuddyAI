/**
 * Assessment Service Layer
 *
 * Handles PHQ-9 submission to the Express backend. Uses the shared
 * `apiRequest` utility for JWT auth, 401 redirect handling, and error
 * parsing.
 */

import { apiRequest } from '@/lib/api';
import { SeverityLevel } from '@/types';

export interface Phq9AssessmentResponse {
  id: number;
  userId: number;
  responses: number[];
  totalScore: number;
  severityLevel: SeverityLevel;
  completedAt: string;
}

function validateAnswers(answers: number[]): void {
  if (!Array.isArray(answers) || answers.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 answers.');
  }

  if (!answers.every((a) => typeof a === 'number' && Number.isInteger(a) && a >= 0 && a <= 3)) {
    throw new Error('Each answer must be an integer between 0 and 3.');
  }
}

export const assessmentService = {
  /**
   * Submit a completed PHQ-9 assessment.
   *
   * @param answers Array of 9 integers (0-3)
   * @returns The created assessment with totalScore and severityLevel
   */
  async submitPhq9(answers: number[]): Promise<Phq9AssessmentResponse> {
    validateAnswers(answers);

    return apiRequest('/api/assessments/phq9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses: answers }),
    });
  },
};
