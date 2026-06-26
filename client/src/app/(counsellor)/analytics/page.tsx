'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts } from '@/hooks/useAlerts';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { data: alerts, isLoading } = useAlerts();

  const analytics = useMemo(() => {
    if (!alerts) return null;
    const total = alerts.length;
    const byRisk = {
      LOW: alerts.filter(a => a.riskLevel === 'LOW').length,
      MODERATE: alerts.filter(a => a.riskLevel === 'MODERATE').length,
      HIGH: alerts.filter(a => a.riskLevel === 'HIGH').length,
      SEVERE: alerts.filter(a => a.riskLevel === 'SEVERE').length,
    };
    const byStatus = {
      PENDING: alerts.filter(a => a.status === 'PENDING').length,
      REVIEWED: alerts.filter(a => a.status === 'REVIEWED').length,
      RESOLVED: alerts.filter(a => a.status === 'RESOLVED').length,
    };
    const resolutionRate = total > 0 ? Math.round((byStatus.RESOLVED / total) * 100) : 0;
    return { total, byRisk, byStatus, resolutionRate };
  }, [alerts]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Analytics</h1>
        <p className="mt-1 text-neutral-500">Insights and trends across student alerts.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : analytics ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center text-center py-6">
                <BarChart3 className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-2xl font-semibold text-neutral-800">{analytics.total}</p>
                <p className="text-xs text-neutral-500">Total Alerts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center py-6">
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <p className="text-2xl font-semibold text-neutral-800">{analytics.resolutionRate}%</p>
                <p className="text-xs text-neutral-500">Resolution Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center py-6">
                <PieChart className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-2xl font-semibold text-neutral-800">{analytics.byStatus.PENDING}</p>
                <p className="text-xs text-neutral-500">Awaiting Review</p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Breakdown of alerts by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.byRisk).map(([level, count]) => (
                  <div key={level} className="flex items-center gap-3">
                    <span className="text-sm text-neutral-600 w-24">{level}</span>
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          level === 'SEVERE' ? 'bg-red-400' :
                          level === 'HIGH' ? 'bg-orange-400' :
                          level === 'MODERATE' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-yellow-50">
                  <p className="text-xl font-semibold text-yellow-700">{analytics.byStatus.PENDING}</p>
                  <p className="text-xs text-yellow-600 mt-1">Pending</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-blue-50">
                  <p className="text-xl font-semibold text-blue-700">{analytics.byStatus.REVIEWED}</p>
                  <p className="text-xs text-blue-600 mt-1">Reviewed</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-green-50">
                  <p className="text-xl font-semibold text-green-700">{analytics.byStatus.RESOLVED}</p>
                  <p className="text-xs text-green-600 mt-1">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-sm text-neutral-400">No data available for analytics.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
