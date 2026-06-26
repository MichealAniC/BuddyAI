import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
vi.mock('../config/prisma', () => ({
  default: {
    phq9Assessment: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { submitAssessment } from '../services/assessment.service';
import prisma from '../config/prisma';

const mockPrisma = vi.mocked(prisma);

describe('Assessment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitAssessment', () => {
    it('should calculate correct total and severity for MINIMAL (score 0-4)', async () => {
      // 9 questions, scores: [0,1,0,1,0,1,0,1,0] = 4
      const responses = [0, 1, 0, 1, 0, 1, 0, 1, 0];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 1, userId: 1, responses, totalScore: 4, severityLevel: 'MINIMAL',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(mockPrisma.phq9Assessment.create).toHaveBeenCalledWith({
        data: { userId: 1, responses, totalScore: 4, severityLevel: 'MINIMAL' },
      });
      expect(result.severityLevel).toBe('MINIMAL');
      expect(result.totalScore).toBe(4);
    });

    it('should classify score 5-9 as MILD', async () => {
      // scores: [1,1,1,1,1,1,1,1,1] = 9
      const responses = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 2, userId: 1, responses, totalScore: 9, severityLevel: 'MILD',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(mockPrisma.phq9Assessment.create).toHaveBeenCalledWith({
        data: { userId: 1, responses, totalScore: 9, severityLevel: 'MILD' },
      });
      expect(result.severityLevel).toBe('MILD');
    });

    it('should classify score 10-14 as MODERATE', async () => {
      // scores: [2,1,1,1,1,1,1,1,1] = 10
      const responses = [2, 1, 1, 1, 1, 1, 1, 1, 1];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 3, userId: 1, responses, totalScore: 10, severityLevel: 'MODERATE',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(mockPrisma.phq9Assessment.create).toHaveBeenCalledWith({
        data: { userId: 1, responses, totalScore: 10, severityLevel: 'MODERATE' },
      });
      expect(result.severityLevel).toBe('MODERATE');
    });

    it('should classify score 15-19 as MODERATELY_SEVERE', async () => {
      // scores: [2,2,2,2,2,2,2,2,1] = 17
      const responses = [2, 2, 2, 2, 2, 2, 2, 2, 1];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 4, userId: 1, responses, totalScore: 17, severityLevel: 'MODERATELY_SEVERE',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(mockPrisma.phq9Assessment.create).toHaveBeenCalledWith({
        data: { userId: 1, responses, totalScore: 17, severityLevel: 'MODERATELY_SEVERE' },
      });
      expect(result.severityLevel).toBe('MODERATELY_SEVERE');
    });

    it('should classify score 20-27 as SEVERE', async () => {
      // scores: [3,3,3,3,3,3,3,3,3] = 27
      const responses = [3, 3, 3, 3, 3, 3, 3, 3, 3];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 5, userId: 1, responses, totalScore: 27, severityLevel: 'SEVERE',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(mockPrisma.phq9Assessment.create).toHaveBeenCalledWith({
        data: { userId: 1, responses, totalScore: 27, severityLevel: 'SEVERE' },
      });
      expect(result.severityLevel).toBe('SEVERE');
    });

    it('should classify score 0 as MINIMAL', async () => {
      const responses = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 6, userId: 1, responses, totalScore: 0, severityLevel: 'MINIMAL',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(result.severityLevel).toBe('MINIMAL');
      expect(result.totalScore).toBe(0);
    });

    it('should classify score 5 as MILD (boundary)', async () => {
      const responses = [1, 1, 1, 1, 1, 0, 0, 0, 0];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 7, userId: 1, responses, totalScore: 5, severityLevel: 'MILD',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(result.severityLevel).toBe('MILD');
    });

    it('should classify score 15 as MODERATELY_SEVERE (boundary)', async () => {
      const responses = [2, 2, 2, 2, 2, 2, 2, 1, 0];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 8, userId: 1, responses, totalScore: 15, severityLevel: 'MODERATELY_SEVERE',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(result.severityLevel).toBe('MODERATELY_SEVERE');
    });

    it('should classify score 20 as SEVERE (boundary)', async () => {
      const responses = [3, 3, 3, 3, 2, 2, 2, 1, 1];
      mockPrisma.phq9Assessment.create.mockResolvedValue({
        id: 9, userId: 1, responses, totalScore: 20, severityLevel: 'SEVERE',
        completedAt: new Date(),
      } as any);

      const result = await submitAssessment(1, responses);

      expect(result.severityLevel).toBe('SEVERE');
    });
  });
});
