'use client';

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import {
  useUrgentAlerts,
  useDashboardStats,
  useAnalyticsSnapshot,
  useUpdateAlert,
} from '@/hooks/useAlerts';
import { useToast } from '@/hooks/useToast';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatRelativeTime } from '@/utils/formatters';
import { getHighRiskStudentCount } from '@/services/counsellorService';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  Inbox,
  Activity,
  Timer,
  UserCircle,
  ClipboardCheck,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { UrgentAlert } from '@/services/counsellorService';

export default function OverviewPage() {
  const { data: alerts, isLoading: alertsLoading } = useUrgentAlerts();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: snapshot, isLoading: snapshotLoading } = useAnalyticsSnapshot();
  const { showToast } = useToast();

  const pendingAlerts = stats?.alerts?.pending ?? 0;
  const underReviewAlerts = stats?.alerts?.underReview ?? 0;
  const followUpAlerts = stats?.alerts?.followUpScheduled ?? 0;
  const resolvedAlerts = stats?.alerts?.resolved ?? 0;
  const totalStudents = stats?.totalStudents ?? 0;
  const highRiskStudents = stats?.riskDistribution
    ? getHighRiskStudentCount(stats.riskDistribution)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text">Counsellor Overview</h1>
        <p className="mt-1 text-text-muted">
          Which students require your attention today?
        </p>
      </div>

      {/* System Snapshot */}
      <div>
        <h2 className="text-sm font-medium text-text-muted mb-3">System Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Pending Alerts"
            value={snapshot?.pendingAlerts ?? 0}
            icon={AlertTriangle}
            color="text-amber-600"
            bg="bg-amber-50"
            loading={snapshotLoading}
          />
          <MetricCard
            label="High/Critical Risk"
            value={snapshot?.highRiskStudents ?? 0}
            icon={Activity}
            color="text-rose-600"
            bg="bg-rose-50"
            loading={snapshotLoading}
          />
          <MetricCard
            label="Avg Response Time"
            value={`${snapshot?.averageResponseTimeHours ?? 0}h`}
            icon={Timer}
            color="text-primary-600"
            bg="bg-primary-50"
            loading={snapshotLoading}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Critical Alerts"
          value={pendingAlerts}
          icon={ShieldAlert}
          color="text-rose-600"
          bg="bg-rose-50"
          loading={statsLoading}
        />
        <MetricCard
          label="High Risk Students"
          value={highRiskStudents}
          icon={AlertTriangle}
          color="text-amber-600"
          bg="bg-amber-50"
          loading={statsLoading}
        />
        <MetricCard
          label="Pending Reviews"
          value={pendingAlerts}
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
          loading={statsLoading}
        />
        <MetricCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          color="text-primary-600"
          bg="bg-primary-50"
          loading={statsLoading}
        />
      </div>

      {/* Urgent Alerts Inbox */}
      <SanctuaryCard>
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alert Inbox</CardTitle>
            <CardDescription>Risk alerts that need your attention</CardDescription>
          </div>
          <Link href="/alerts">
            <span className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </span>
          </Link>
        </CardHeader>

        {alertsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </SanctuaryCard>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SanctuaryCard variant="sage" className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sage-100">
              <CheckCircle className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Resolved This Period</p>
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-xl font-semibold text-text">{resolvedAlerts}</p>
              )}
            </div>
          </div>
        </SanctuaryCard>

        <SanctuaryCard variant="primary" className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Under Review / Follow-up</p>
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-xl font-semibold text-text">{underReviewAlerts + followUpAlerts}</p>
              )}
            </div>
          </div>
        </SanctuaryCard>
      </div>
    </div>
  );
}

function AlertItem({ alert }: { alert: UrgentAlert }) {
  const { showToast } = useToast();
  const updateAlert = useUpdateAlert(alert.id);

  const handleMarkReviewed = async () => {
    try {
      await updateAlert.mutateAsync({ status: 'RESOLVED' });
      showToast('Alert marked as reviewed', 'success');
    } catch {
      showToast('Failed to update alert', 'error');
    }
  };

  const handleAssignCase = async () => {
    try {
      await updateAlert.mutateAsync({ status: 'UNDER_REVIEW' });
      showToast('Case assigned to you', 'success');
    } catch {
      showToast('Failed to assign case', 'error');
    }
  };

  const isActionLoading = updateAlert.isPending;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-card bg-surface-secondary border border-border hover:border-primary-200 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated shadow-card">
          <UserCircle className="h-5 w-5 text-primary-500" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-text truncate">
              {alert.user?.fullName || 'Unknown Student'}
            </p>
            <Badge className={getRiskColor(alert.riskLevel)}>{alert.riskLevel}</Badge>
            <Badge className={getAlertStatusColor(alert.status)}>{alert.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1.5">
            {alert.assessment
              ? `PHQ-9 score ${alert.assessment.totalScore}/27 · ${alert.assessment.severityLevel.replace('_', ' ')}`
              : alert.triggers?.slice(0, 2).join(', ') || 'Risk alert triggered'}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Opened {formatRelativeTime(alert.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-surface-elevated hover:bg-surface-secondary"
          asChild
        >
          <Link href={`/students/${alert.userId}`}>
            <UserCircle className="w-3.5 h-3.5 mr-1" />
            Profile
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100"
          onClick={handleAssignCase}
          disabled={isActionLoading || alert.status === 'UNDER_REVIEW'}
        >
          <ClipboardCheck className="w-3.5 h-3.5 mr-1" />
          Assign
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-sage-200 bg-sage-50 text-sage-700 hover:bg-sage-100"
          onClick={handleMarkReviewed}
          disabled={isActionLoading || alert.status === 'RESOLVED'}
        >
          <UserCheck className="w-3.5 h-3.5 mr-1" />
          Reviewed
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-600 hover:text-primary-700"
          asChild
        >
          <Link href={`/alerts/${alert.id}`}>
            Review
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  loading: boolean;
}

function MetricCard({ label, value, icon: Icon, color, bg, loading }: MetricCardProps) {
  return (
    <SanctuaryCard className="p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-text-muted">{label}</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mt-1" />
          ) : (
            <p className="text-xl font-semibold text-text">{value}</p>
          )}
        </div>
      </div>
    </SanctuaryCard>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="p-4 rounded-2xl bg-sage-50 mb-4">
        <Inbox className="w-8 h-8 text-sage-500" />
      </div>
      <h3 className="font-medium text-text">No active alerts</h3>
      <p className="text-sm text-text-muted mt-1 max-w-xs">
        You&apos;re all caught up — have a great day! Check back later for new student alerts.
      </p>
    </div>
  );
}
