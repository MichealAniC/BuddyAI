'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts, useDashboardStats } from '@/hooks/useAlerts';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatRelativeTime } from '@/utils/formatters';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const pendingAlerts = alerts?.filter(a => a.status === 'PENDING') || [];
  const recentAlerts = alerts?.slice(0, 5) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Overview</h1>
        <p className="mt-1 text-neutral-500">Monitor student wellbeing at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="p-2.5 rounded-xl bg-blue-50">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Total Students</p>
              {statsLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-semibold text-neutral-800">{(stats as any)?.totalStudents || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="p-2.5 rounded-xl bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Pending Alerts</p>
              {alertsLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-semibold text-neutral-800">{pendingAlerts.length}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="p-2.5 rounded-xl bg-yellow-50">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Under Review</p>
              {alertsLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-semibold text-neutral-800">
                  {alerts?.filter(a => a.status === 'REVIEWED').length || 0}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="p-2.5 rounded-xl bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Resolved</p>
              {alertsLoading ? <Skeleton className="h-6 w-12" /> : (
                <p className="text-xl font-semibold text-neutral-800">
                  {alerts?.filter(a => a.status === 'RESOLVED').length || 0}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
          </div>
          <Link href="/alerts">
            <span className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</span>
          </Link>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : recentAlerts.length > 0 ? (
            <div className="space-y-2">
              {recentAlerts.map((alert) => (
                <Link key={alert.id} href={`/alerts/${alert.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-[10px] bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(alert.riskLevel)}>
                        {alert.riskLevel}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          Risk Alert — {alert.riskLevel} Level
                        </p>
                        <p className="text-xs text-neutral-500">
                          {alert.triggers?.slice(0, 2).join(', ') || 'No triggers specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <span className="text-xs text-neutral-400">{formatRelativeTime(alert.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-6">No alerts at this time. All clear!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
