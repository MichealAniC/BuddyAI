'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Phq9Assessment } from '@/types';

export function useAssessments() {
  return useQuery<Phq9Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => apiRequest('/api/assessments/phq9'),
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answers: number[]) =>
      apiRequest('/api/assessments/phq9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
}
