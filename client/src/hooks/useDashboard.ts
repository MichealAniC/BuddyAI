'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { MoodEntry, Phq9Assessment } from '@/types';

interface DashboardData {
  recentMoods: MoodEntry[];
  latestAssessment: Phq9Assessment | null;
  riskLevel: string | null;
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [moodsRes, assessmentRes, riskRes] = await Promise.allSettled([
        apiRequest('/api/mood'),
        apiRequest('/api/assessments/phq9'),
        apiRequest('/api/risk/latest'),
      ]);

      const recentMoods =
        moodsRes.status === 'fulfilled'
          ? (moodsRes.value as MoodEntry[]).slice(0, 7)
          : [];

      let latestAssessment = null;
      if (assessmentRes.status === 'fulfilled') {
        const assessments = assessmentRes.value as Phq9Assessment[];
        latestAssessment = assessments.length > 0 ? assessments[0] : null;
      }

      let riskLevel = null;
      if (riskRes.status === 'fulfilled' && riskRes.value) {
        riskLevel = (riskRes.value as any).riskLevel || null;
      }

      return { recentMoods, latestAssessment, riskLevel };
    },
  });
}
