'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { useStudentProfile } from '@/hooks/useAlerts';
import { getAlertStatusColor, getRiskColor, getSeverityColor } from '@/utils/colors';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';
import { getMoodEmojiForRating, getMoodLabelForRating } from '@/utils/moodMapping';
import { AlertTriangle, ArrowLeft, Calendar, ClipboardList, Frown, Smile, User } from 'lucide-react';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useStudentProfile(id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <BackLink />
        <SanctuaryCard>
          <div className="text-center py-12">
            <p className="text-neutral-500">Unable to load student profile.</p>
            <p className="text-sm text-neutral-400 mt-1">
              {(error as Error)?.message || 'Please try again later.'}
            </p>
          </div>
        </SanctuaryCard>
      </div>
    );
  }

  const { user, assessments, moodEntries, riskAlerts } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <BackLink />

      {/* Header */}
      <SanctuaryCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-800">{user.fullName}</h1>
              <p className="text-sm text-neutral-500">{user.email}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                <span>{user.gender || '—'}</span>
                <span>•</span>
                <span>{user.age ? `${user.age} years` : '—'}</span>
                <span>•</span>
                <span>Registered {formatRelativeTime(user.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right px-4 py-2 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Assessments</p>
              <p className="text-lg font-semibold text-neutral-800">{assessments.length}</p>
            </div>
            <div className="text-right px-4 py-2 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Mood Entries</p>
              <p className="text-lg font-semibold text-neutral-800">{moodEntries.length}</p>
            </div>
            <div className="text-right px-4 py-2 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Alerts</p>
              <p className="text-lg font-semibold text-neutral-800">{riskAlerts.length}</p>
            </div>
          </div>
        </div>
      </SanctuaryCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellbeing Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary-500" />
              Wellbeing Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 && moodEntries.length === 0 ? (
              <EmptyState
                icon={<Smile className="w-8 h-8 text-neutral-300" />}
                title="No wellbeing data recorded yet"
                message="PHQ-9 assessments and mood entries will appear here once the student starts using BuddyAI."
              />
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {buildTimeline(assessments, moodEntries).map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Case History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskAlerts.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="w-8 h-8 text-neutral-300" />}
                title="No risk alerts recorded"
                message="This student has not generated any risk alerts. Alerts appear here when elevated risk is detected."
              />
            ) : (
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-[10px] border border-border bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(alert.riskLevel)}>
                            {alert.riskLevel}
                          </Badge>
                          <Badge className={getAlertStatusColor(alert.status)}>
                            {alert.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-400 mt-2">
                          {formatDateTime(alert.createdAt)}
                        </p>
                      </div>
                      {alert.assessment && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-neutral-700">
                            {alert.assessment.totalScore}/27
                          </p>
                          <p className="text-xs text-neutral-500">PHQ-9</p>
                        </div>
                      )}
                    </div>
                    {alert.notes && (
                      <div className="mt-3 p-2.5 rounded-[8px] bg-neutral-50 text-sm text-neutral-600">
                        {alert.notes}
                      </div>
                    )}
                    {alert.followUpDate && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-500">
                        <Calendar className="w-3.5 h-3.5" />
                        Follow-up: {formatDateTime(alert.followUpDate)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/students"
      className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Students
    </Link>
  );
}

function EmptyState({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="p-3 rounded-2xl bg-neutral-50 mb-3">{icon}</div>
      <h3 className="font-medium text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs">{message}</p>
    </div>
  );
}

type TimelineEvent =
  | { id: string; type: 'mood'; date: string; moodRating: number; notes?: string }
  | { id: string; type: 'assessment'; date: string; totalScore: number; severityLevel: string };

function buildTimeline(
  assessments: { id: string; completedAt: string; totalScore: number; severityLevel: string }[],
  moodEntries: { id: string; createdAt: string; moodRating: number; notes?: string }[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    ...assessments.map((a) => ({
      id: `a-${a.id}`,
      type: 'assessment' as const,
      date: a.completedAt,
      totalScore: a.totalScore,
      severityLevel: a.severityLevel,
    })),
    ...moodEntries.map((m) => ({
      id: `m-${m.id}`,
      type: 'mood' as const,
      date: m.createdAt,
      moodRating: m.moodRating,
      notes: m.notes,
    })),
  ];
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function TimelineItem({ item }: { item: TimelineEvent }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full ${item.type === 'assessment' ? 'bg-primary-400' : 'bg-green-400'}`} />
        <div className="w-0.5 flex-1 bg-neutral-200 my-1" />
      </div>
      <div className="pb-4 flex-1">
        <p className="text-xs text-neutral-400">{formatDateTime(item.date)}</p>
        {item.type === 'assessment' ? (
          <div className="mt-1 p-3 rounded-[10px] bg-neutral-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700">PHQ-9 Assessment</span>
              </div>
              <Badge className={getSeverityColor(item.severityLevel as any)}>
                {item.severityLevel.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              Score: <span className="font-semibold text-neutral-800">{item.totalScore}/27</span>
            </p>
          </div>
        ) : (
          <div className="mt-1 p-3 rounded-[10px] bg-neutral-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getMoodEmojiForRating(item.moodRating)}</span>
                <span className="text-sm font-medium text-neutral-700">
                  {getMoodLabelForRating(item.moodRating)}
                </span>
              </div>
              <Frown className="w-4 h-4 text-neutral-300" />
            </div>
            {item.notes && (
              <p className="text-sm text-neutral-600 mt-2 italic">&ldquo;{item.notes}&rdquo;</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
