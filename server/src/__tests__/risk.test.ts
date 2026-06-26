import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
vi.mock('../config/prisma', () => ({
  default: {
    phq9Assessment: {
      findFirst: vi.fn(),
    },
    message: {
      findMany: vi.fn(),
    },
    moodEntry: {
      findMany: vi.fn(),
    },
    recommendation: {
      create: vi.fn(),
    },
    riskAlert: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { evaluateRisk } from '../services/risk.service';
import prisma from '../config/prisma';

const mockPrisma = vi.mocked(prisma);

// Helper to set up common mocks
function setupMocks(opts: {
  phqScore: number | null;
  messages?: Array<{ sentiment: string | null }>;
  recentMoods?: Array<{ moodRating: number }>;
  olderMoods?: Array<{ moodRating: number }>;
  existingAlert?: boolean;
}) {
  const { phqScore, messages = [], recentMoods = [], olderMoods = [], existingAlert = false } = opts;

  // Latest PHQ-9 assessment
  mockPrisma.phq9Assessment.findFirst.mockResolvedValue(
    phqScore !== null
      ? ({ id: 1, userId: 1, totalScore: phqScore, completedAt: new Date() } as any)
      : null
  );

  // Recent messages
  mockPrisma.message.findMany.mockResolvedValue(messages as any);

  // Mood entries: first call = recent, second call = older
  mockPrisma.moodEntry.findMany
    .mockResolvedValueOnce(recentMoods as any)  // recent (7 days)
    .mockResolvedValueOnce(olderMoods as any);  // older (30 days)

  // Recommendation creation (just return the data)
  mockPrisma.recommendation.create.mockResolvedValue({ id: 1 } as any);

  // Risk alert mocks
  mockPrisma.riskAlert.findFirst.mockResolvedValue(existingAlert ? ({ id: 1 } as any) : null);
  mockPrisma.riskAlert.create.mockResolvedValue({ id: 1 } as any);
}

describe('Risk Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('evaluateRisk', () => {
    it('should return SEVERE when PHQ-9 >= 20', async () => {
      setupMocks({ phqScore: 22 });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('SEVERE');
      expect(result.factors).toEqual(
        expect.arrayContaining([expect.stringContaining('PHQ-9 score is 22')])
      );
      expect(result.recommendation).toContain('serious concern');
      // Should create a risk alert for SEVERE
      expect(mockPrisma.riskAlert.create).toHaveBeenCalled();
    });

    it('should return SEVERE for PHQ-9 score of exactly 20', async () => {
      setupMocks({ phqScore: 20 });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('SEVERE');
    });

    it('should return HIGH when PHQ-9 >= 15 with high negative sentiment', async () => {
      // 3 out of 4 messages are NEGATIVE => ratio 0.75 > 0.5
      setupMocks({
        phqScore: 16,
        messages: [
          { sentiment: 'NEGATIVE' },
          { sentiment: 'NEGATIVE' },
          { sentiment: 'NEGATIVE' },
          { sentiment: 'POSITIVE' },
        ],
      });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('HIGH');
      expect(result.factors.some(f => f.includes('PHQ-9 score is 16'))).toBe(true);
      expect(result.factors.some(f => f.includes('negative sentiment'))).toBe(true);
      expect(mockPrisma.riskAlert.create).toHaveBeenCalled();
    });

    it('should return MODERATE (not HIGH) when PHQ-9 >= 15 but negative sentiment <= 50%', async () => {
      // 1 out of 4 messages NEGATIVE => ratio 0.25 (not > 0.5)
      setupMocks({
        phqScore: 16,
        messages: [
          { sentiment: 'NEGATIVE' },
          { sentiment: 'POSITIVE' },
          { sentiment: 'POSITIVE' },
          { sentiment: 'POSITIVE' },
        ],
      });

      const result = await evaluateRisk(1);

      // Falls through to phqScore >= 10 rule => MODERATE
      expect(result.riskLevel).toBe('MODERATE');
    });

    it('should return MODERATE when PHQ-9 >= 10', async () => {
      setupMocks({ phqScore: 12 });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('MODERATE');
      expect(result.factors.some(f => f.includes('PHQ-9 score is 12'))).toBe(true);
    });

    it('should return MODERATE when mood is declining (even with low PHQ-9)', async () => {
      // recentAvg = 3, olderAvg = 7 => diff = -4 < -0.5 => declining
      setupMocks({
        phqScore: 5,
        recentMoods: [{ moodRating: 3 }, { moodRating: 3 }],
        olderMoods: [{ moodRating: 7 }, { moodRating: 7 }],
      });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('MODERATE');
      expect(result.factors).toContain('Mood trend is declining');
    });

    it('should return LOW for low scores with no decline', async () => {
      setupMocks({
        phqScore: 3,
        messages: [{ sentiment: 'POSITIVE' }, { sentiment: 'POSITIVE' }],
        recentMoods: [{ moodRating: 7 }, { moodRating: 8 }],
        olderMoods: [{ moodRating: 7 }, { moodRating: 8 }],
      });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('LOW');
      expect(result.factors).toContain('All indicators within normal range');
      // No risk alert for LOW
      expect(mockPrisma.riskAlert.create).not.toHaveBeenCalled();
    });

    it('should return LOW when no assessment and no mood data', async () => {
      setupMocks({
        phqScore: null,
        messages: [],
        recentMoods: [],
        olderMoods: [],
      });

      const result = await evaluateRisk(1);

      expect(result.riskLevel).toBe('LOW');
    });

    it('should not create duplicate risk alert if one already exists', async () => {
      setupMocks({ phqScore: 22, existingAlert: true });

      await evaluateRisk(1);

      // Should check for existing alert but NOT create a new one
      expect(mockPrisma.riskAlert.findFirst).toHaveBeenCalled();
      expect(mockPrisma.riskAlert.create).not.toHaveBeenCalled();
    });
  });
});
