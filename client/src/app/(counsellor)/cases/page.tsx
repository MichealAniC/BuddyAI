'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts } from '@/hooks/useAlerts';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatRelativeTime } from '@/utils/formatters';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';

export default function CasesPage() {
  const { data: alerts, isLoading } = useAlerts();

  // Cases = alerts currently under review or with follow-up scheduled
  const activeCases = alerts?.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'FOLLOW_UP_SCHEDULED') || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Cases</h1>
        <p className="mt-1 text-neutral-500">Tracked cases currently under review.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : activeCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCases.map((c) => (
            <Link key={c.id} href={`/alerts/${c.id}`}>
              <Card className="hover:shadow-elevated transition-shadow cursor-pointer h-full">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-700">Case</span>
                    </div>
                    <Badge className={getRiskColor(c.riskLevel)}>{c.riskLevel}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {c.triggers?.slice(0, 2).join(' • ') || 'No triggers specified'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge className={getAlertStatusColor(c.status)}>{c.status}</Badge>
                    <span className="text-xs text-neutral-400">{formatRelativeTime(c.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center text-center py-12">
            <FolderOpen className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500">No active cases at the moment.</p>
            <p className="text-xs text-neutral-400 mt-1">Cases appear here when alerts are under review or have a follow-up scheduled.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
