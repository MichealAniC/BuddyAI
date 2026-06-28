'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { AlertStatus, RiskAlert } from '@/types';
import {
  counsellorService,
  CounsellorDashboardStats,
  ReportData,
  StudentProfile,
  SystemSnapshot,
  UrgentAlert,
} from '@/services/counsellorService';

export function useAlerts() {
  return useQuery<RiskAlert[]>({
    queryKey: ['alerts'],
    queryFn: () => apiRequest('/api/alerts'),
  });
}

export function useUrgentAlerts() {
  return useQuery<UrgentAlert[]>({
    queryKey: ['alerts', 'urgent'],
    queryFn: () => counsellorService.getUrgentAlerts(),
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

export function useStudentProfile(id: string) {
  return useQuery<StudentProfile>({
    queryKey: ['students', id, 'profile'],
    queryFn: () => counsellorService.getStudentProfile(id),
    enabled: !!id,
  });
}

export function useUpdateAlert(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { status?: AlertStatus; notes?: string; followUpDate?: string | null }) =>
      apiRequest(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', id] });
      queryClient.invalidateQueries({ queryKey: ['alerts', id, 'student'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'urgent'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery<CounsellorDashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => counsellorService.getDashboardStats(),
  });
}

export function useAnalyticsSnapshot() {
  return useQuery<SystemSnapshot>({
    queryKey: ['analytics', 'snapshot'],
    queryFn: () => counsellorService.getSystemSnapshot(),
  });
}

export function useAnalyticsReportData() {
  return useQuery<ReportData>({
    queryKey: ['analytics', 'report-data'],
    queryFn: () => counsellorService.getReportData(),
  });
}
