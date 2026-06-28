/**
 * Mood Mapping Utility
 *
 * Centralised mapping between the numeric `moodRating` stored in the
 * backend/API (1-5) and the friendly emoji/label shown in the UI.
 */

export const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😟',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const MOOD_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export function getMoodEmojiForRating(moodRating: number): string {
  return MOOD_EMOJIS[moodRating] || '😐';
}

export function getMoodLabelForRating(moodRating: number): string {
  return MOOD_LABELS[moodRating] || 'Unknown';
}
