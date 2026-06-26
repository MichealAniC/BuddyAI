'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { RiskAlert } from '@/types';

export function useAlerts() {
  return useQuery<RiskAlert[]>({
    queryKey: ['alerts'],
    queryFn: () => apiRequest('/api/alerts'),
  });
}

export function useAlert(id: string) {
  return useQuery<RiskAlert>({
    queryKey: ['alerts', id],
    queryFn: () => apiRequest(`/api/alerts/${id}`),
    enabled: !!id,
  });
}

export function useAlertStudent(id: string) {
  return useQuery({
    queryKey: ['alerts', id, 'student'],
    queryFn: () => apiRequest(`/api/alerts/${id}/student`),
    enabled: !!id,
  });
}

export function useUpdateAlert(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { status?: string; notes?: string }) =>
      apiRequest(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', id] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiRequest('/api/dashboard/stats'),
  });
}
