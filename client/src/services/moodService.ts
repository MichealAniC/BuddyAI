/**
 * Mood Service Layer
 *
 * Thin wrapper around the shared `apiRequest` utility for mood-related
 * network operations. Keeps transport logic out of UI components.
 */

import { apiRequest } from '@/lib/api';

export interface MoodLogPayload {
  moodRating: number;
  notes?: string;
}

export interface MoodLogResponse {
  id: number;
  userId: number;
  moodRating: number;
  notes: string | null;
  createdAt: string;
}

function validateRating(rating: number): void {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Mood rating must be an integer between 1 and 5.');
  }
}

export const moodService = {
  /**
   * Log a new mood entry via the Express backend.
   * Validates the rating before sending.
   */
  async logMood(rating: number, notes?: string): Promise<MoodLogResponse> {
    validateRating(rating);

    const payload: MoodLogPayload = { moodRating: rating };
    if (notes && notes.trim()) {
      payload.notes = notes.trim();
    }

    return apiRequest('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
