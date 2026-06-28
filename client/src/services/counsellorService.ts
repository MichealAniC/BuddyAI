/**
 * Counsellor Service Layer
 *
 * Aggregates dashboard metrics, urgent alerts, and student directory data
 * for the Counsellor portal. All calls are authenticated via the shared
 * `apiRequest` utility.
 */

import { apiRequest } from '@/lib/api';
import { MoodEntry, Phq9Assessment, RiskAlert, RiskLevel, User } from '@/types';

export interface AlertBreakdown {
  total: number;
  pending: number;
  underReview: number;
  followUpScheduled: number;
  resolved: number;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
}

export interface CounsellorDashboardStats {
  totalStudents: number;
  alerts: AlertBreakdown;
  riskDistribution: RiskDistributionItem[];
}

export interface UrgentAlert extends RiskAlert {
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  assessment?: {
    totalScore: number;
    severityLevel: string;
    completedAt: string;
  };
}

export interface StudentDirectoryItem extends User {
  _count?: {
    riskAlerts: number;
    assessments: number;
  };
}

export interface StudentProfile {
  user: User;
  assessments: Phq9Assessment[];
  moodEntries: MoodEntry[];
  riskAlerts: RiskAlert[];
}

export interface SystemSnapshot {
  pendingAlerts: number;
  highRiskStudents: number;
  averageResponseTimeHours: number;
}

export interface ReportData {
  populationHealth: { level: string; count: number }[];
  trendData: { month: string; averageScore: number }[];
  resolutionVelocity: { status: string; averageHours: number }[];
}

export const counsellorService = {
  /**
   * Fetch high-level dashboard statistics for the counsellor portal.
   */
  async getDashboardStats(): Promise<CounsellorDashboardStats> {
    return apiRequest('/api/dashboard/stats');
  },

  /**
   * Fetch all registered students for the counsellor directory.
   */
  async getCounsellorStudents(): Promise<StudentDirectoryItem[]> {
    return apiRequest('/api/users/students') as Promise<StudentDirectoryItem[]>;
  },

  /**
   * Fetch a single student's full profile including assessments,
   * mood entries, and risk alerts.
   */
  async getStudentProfile(id: string): Promise<StudentProfile> {
    return apiRequest(`/api/users/students/${id}`) as Promise<StudentProfile>;
  },

  /**
   * Fetch real-time system snapshot KPIs for the counsellor overview.
   */
  async getSystemSnapshot(): Promise<SystemSnapshot> {
    return apiRequest('/api/analytics/snapshot') as Promise<SystemSnapshot>;
  },

  /**
   * Fetch report data for charts: population health, wellbeing trend,
   * and case resolution velocity.
   */
  async getReportData(): Promise<ReportData> {
    return apiRequest('/api/analytics/report-data') as Promise<ReportData>;
  },

  /**
   * Fetch risk alerts that require attention.
   *
   * Defaults to pending alerts (oldest first) so counsellors see what
   * needs action. Limited to the most recent 20.
   */
  async getUrgentAlerts(limit = 20): Promise<UrgentAlert[]> {
    const alerts = (await apiRequest('/api/alerts?status=PENDING')) as UrgentAlert[];
    return alerts
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, limit);
  },

  /**
   * Fetch high/sever risk alerts regardless of status.
   */
  async getHighRiskAlerts(limit = 20): Promise<UrgentAlert[]> {
    const high = (await apiRequest('/api/alerts?riskLevel=HIGH')) as UrgentAlert[];
    const severe = (await apiRequest('/api/alerts?riskLevel=SEVERE')) as UrgentAlert[];
    return [...high, ...severe]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, limit);
  },
};

/**
 * Helper to count students flagged as High or Severe risk from the
 * distribution array returned by the dashboard stats endpoint.
 */
export function getHighRiskStudentCount(distribution: RiskDistributionItem[]): number {
  return distribution
    .filter((item) => item.level === 'HIGH' || item.level === 'SEVERE')
    .reduce((sum, item) => sum + item.count, 0);
}
