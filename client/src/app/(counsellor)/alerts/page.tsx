'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts } from '@/hooks/useAlerts';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatRelativeTime } from '@/utils/formatters';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AlertStatus, RiskLevel } from '@/types';

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((alert) => {
      if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
      if (riskFilter !== 'ALL' && alert.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [alerts, statusFilter, riskFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Alerts</h1>
        <p className="mt-1 text-neutral-500">Review and manage student risk alerts.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-[10px]">
          {(['ALL', 'PENDING', 'UNDER_REVIEW', 'FOLLOW_UP_SCHEDULED', 'RESOLVED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as AlertStatus | 'ALL')}
              className={cn(
                'px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all',
                statusFilter === status
                  ? 'bg-surface-elevated shadow-card text-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              {status === 'ALL' ? 'All Status' : status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-[10px]">
          {(['ALL', 'SEVERE', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level as RiskLevel | 'ALL')}
              className={cn(
                'px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all',
                riskFilter === level
                  ? 'bg-surface-elevated shadow-card text-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              {level === 'ALL' ? 'All Risk' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <Card>
        <CardContent className="py-2">
          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredAlerts.map((alert) => (
                <Link key={alert.id} href={`/alerts/${alert.id}`}>
                  <div className="flex items-center justify-between py-4 px-2 hover:bg-neutral-50 rounded-[10px] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(alert.riskLevel)}>
                        {alert.riskLevel}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          Risk Alert
                        </p>
                        <p className="text-xs text-neutral-500">
                          {alert.triggers?.slice(0, 3).join(' • ') || 'No triggers'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getAlertStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <span className="text-xs text-neutral-400 min-w-[60px] text-right">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">
              No alerts match your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
