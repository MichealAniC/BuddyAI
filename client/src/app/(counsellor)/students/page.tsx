'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useAlerts } from '@/hooks/useAlerts';
import { getRiskColor } from '@/utils/colors';
import { formatRelativeTime } from '@/utils/formatters';
import { Search, Users } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function StudentsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const [search, setSearch] = useState('');

  // Group alerts by userId to create a pseudo student list
  const students = useMemo(() => {
    if (!alerts) return [];
    const studentMap = new Map<string, { userId: string; alertCount: number; latestRisk: string; lastActivity: string }>();
    alerts.forEach((alert) => {
      const existing = studentMap.get(alert.userId);
      if (!existing || new Date(alert.createdAt) > new Date(existing.lastActivity)) {
        studentMap.set(alert.userId, {
          userId: alert.userId,
          alertCount: (existing?.alertCount || 0) + 1,
          latestRisk: alert.riskLevel,
          lastActivity: alert.createdAt,
        });
      } else {
        studentMap.set(alert.userId, { ...existing, alertCount: existing.alertCount + 1 });
      }
    });
    return Array.from(studentMap.values()).filter((s) =>
      s.userId.toLowerCase().includes(search.toLowerCase())
    );
  }, [alerts, search]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Students</h1>
        <p className="mt-1 text-neutral-500">Students with active or past risk alerts.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search by student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="py-2">
          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : students.length > 0 ? (
            <div className="divide-y divide-border">
              {students.map((student) => (
                <div key={student.userId} className="flex items-center justify-between py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Student</p>
                      <p className="text-xs text-neutral-500 font-mono">{student.userId.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRiskColor(student.latestRisk as any)}>{student.latestRisk}</Badge>
                    <span className="text-xs text-neutral-400">{student.alertCount} alert{student.alertCount > 1 ? 's' : ''}</span>
                    <span className="text-xs text-neutral-400">{formatRelativeTime(student.lastActivity)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-8">No student data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
