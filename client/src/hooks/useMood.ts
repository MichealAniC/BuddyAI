'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { MoodEntry } from '@/types';

export function useMoodEntries() {
  return useQuery<MoodEntry[]>({
    queryKey: ['mood'],
    queryFn: () => apiRequest('/api/mood'),
  });
}

export function useMoodTrends() {
  return useQuery({
    queryKey: ['mood', 'trends'],
    queryFn: () => apiRequest('/api/mood/trends'),
  });
}

export function useCreateMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { moodRating: number; notes?: string }) =>
      apiRequest('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
    },
  });
}
