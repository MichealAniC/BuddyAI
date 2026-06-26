import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
vi.mock('../config/prisma', () => ({
  default: {
    moodEntry: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { createMoodEntry, getMoodTrends } from '../services/mood.service';
import prisma from '../config/prisma';

const mockPrisma = vi.mocked(prisma);

describe('Mood Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMoodEntry', () => {
    it('should create entry with correct data', async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        moodRating: 7,
        notes: 'Feeling good today',
        createdAt: new Date(),
      };
      mockPrisma.moodEntry.create.mockResolvedValue(mockEntry as any);

      const result = await createMoodEntry(1, 7, 'Feeling good today');

      expect(mockPrisma.moodEntry.create).toHaveBeenCalledWith({
        data: { userId: 1, moodRating: 7, notes: 'Feeling good today' },
      });
      expect(result).toEqual(mockEntry);
    });

    it('should create entry without notes', async () => {
      const mockEntry = { id: 2, userId: 1, moodRating: 5, notes: null, createdAt: new Date() };
      mockPrisma.moodEntry.create.mockResolvedValue(mockEntry as any);

      const result = await createMoodEntry(1, 5);

      expect(mockPrisma.moodEntry.create).toHaveBeenCalledWith({
        data: { userId: 1, moodRating: 5, notes: undefined },
      });
    });
  });

  describe('getMoodTrends', () => {
    it('should classify direction as "improving" when recent avg is higher by > 0.5', async () => {
      const recentEntries = [
        { moodRating: 8, createdAt: new Date() },
        { moodRating: 9, createdAt: new Date() },
      ];
      const olderEntries = [
        { moodRating: 5, createdAt: new Date() },
        { moodRating: 6, createdAt: new Date() },
      ];
      // recentAvg = 8.5, olderAvg = 5.5, diff = 3.0 > 0.5 => improving
      mockPrisma.moodEntry.findMany
        .mockResolvedValueOnce(recentEntries as any)
        .mockResolvedValueOnce(olderEntries as any);

      const result = await getMoodTrends(1);

      expect(result.direction).toBe('improving');
      expect(result.recentAverage).toBe(8.5);
      expect(result.thirtyDayAverage).toBe(5.5);
      expect(result.totalEntries).toBe(4);
    });

    it('should classify direction as "declining" when recent avg is lower by > 0.5', async () => {
      const recentEntries = [
        { moodRating: 3, createdAt: new Date() },
        { moodRating: 4, createdAt: new Date() },
      ];
      const olderEntries = [
        { moodRating: 7, createdAt: new Date() },
        { moodRating: 8, createdAt: new Date() },
      ];
      // recentAvg = 3.5, olderAvg = 7.5, diff = -4.0 < -0.5 => declining
      mockPrisma.moodEntry.findMany
        .mockResolvedValueOnce(recentEntries as any)
        .mockResolvedValueOnce(olderEntries as any);

      const result = await getMoodTrends(1);

      expect(result.direction).toBe('declining');
      expect(result.recentAverage).toBe(3.5);
      expect(result.thirtyDayAverage).toBe(7.5);
    });

    it('should classify direction as "stable" when difference <= 0.5', async () => {
      const recentEntries = [{ moodRating: 6, createdAt: new Date() }];
      const olderEntries = [{ moodRating: 6, createdAt: new Date() }];
      // recentAvg = 6, olderAvg = 6, diff = 0 => stable
      mockPrisma.moodEntry.findMany
        .mockResolvedValueOnce(recentEntries as any)
        .mockResolvedValueOnce(olderEntries as any);

      const result = await getMoodTrends(1);

      expect(result.direction).toBe('stable');
    });

    it('should return "insufficient_data" when no recent entries', async () => {
      mockPrisma.moodEntry.findMany
        .mockResolvedValueOnce([] as any)  // recent
        .mockResolvedValueOnce([{ moodRating: 6, createdAt: new Date() }] as any); // older

      const result = await getMoodTrends(1);

      expect(result.direction).toBe('insufficient_data');
      expect(result.recentAverage).toBeNull();
    });

    it('should return "insufficient_data" when no older entries', async () => {
      mockPrisma.moodEntry.findMany
        .mockResolvedValueOnce([{ moodRating: 7, createdAt: new Date() }] as any) // recent
        .mockResolvedValueOnce([] as any); // older

      const result = await getMoodTrends(1);

      expect(result.direction).toBe('insufficient_data');
      expect(result.thirtyDayAverage).toBeNull();
    });
  });
});
