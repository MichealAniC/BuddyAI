'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { CardContent } from '@/components/ui/card';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { MoodLogger } from '@/components/features/mood/MoodLogger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageCircle,
  ClipboardList,
  Sparkles,
  Heart,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { getMoodEmoji, formatRelativeTime } from '@/utils/formatters';
import { getMoodLabelForRating } from '@/utils/moodMapping';
import { getSeverityColor } from '@/utils/colors';
import Link from 'next/link';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts';

const wellnessThoughts = [
  "Take a few deep breaths. You're doing great just by being here.",
  'Remember: progress is not always linear, and that is perfectly okay.',
  'A short walk outside can do wonders for your mental clarity.',
  "It's okay to not be okay. What matters is that you're here.",
  'Small steps count. Celebrate your progress, no matter how small.',
  'Your feelings are valid, and reaching out is a sign of strength.',
];

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const queryClient = useQueryClient();

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const tip = wellnessThoughts[Math.floor(Math.random() * wellnessThoughts.length)];

  const handleMoodLogged = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const moodTrendData =
    data?.recentMoods && data.recentMoods.length > 0
      ? [...data.recentMoods]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((m, i) => ({
            label: `D${i + 1}`,
            rating: m.moodRating,
            date: new Date(m.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
          }))
      : [];

  const averageMood =
    data?.recentMoods && data.recentMoods.length > 0
      ? (
          data.recentMoods.reduce((sum, m) => sum + m.moodRating, 0) /
          data.recentMoods.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text">
          Great to see you, {firstName}
        </h1>
        <p className="mt-1 text-text-muted">
          How are you feeling today? We&apos;re here for you.
        </p>
      </div>

      {/* Daily wellness thought */}
      <SanctuaryCard variant="primary" className="p-5">
        <CardContent className="flex items-start gap-4 p-0">
          <div className="p-2.5 rounded-xl bg-primary-100 shrink-0">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-700">Daily Wellness Thought</p>
            <p className="text-sm text-primary-600/90 mt-0.5 leading-relaxed">{tip}</p>
          </div>
        </CardContent>
      </SanctuaryCard>

      {/* Check-in + Snapshot row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in card */}
        <SanctuaryCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-primary-50">
              <Heart className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-text">Daily Check-in</h2>
              <p className="text-xs text-text-muted">A quiet moment just for you</p>
            </div>
          </div>

          <MoodLogger onLogged={handleMoodLogged} />

          <div className="mt-5 pt-5 border-t border-border/50">
            <p className="text-xs font-medium text-text-muted mb-3">Or check in another way</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-border bg-surface-elevated hover:bg-surface-secondary" asChild>
                <Link href="/journey">
                  <ClipboardList className="w-4 h-4 mr-1.5" />
                  PHQ-9 Assessment
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="border-border bg-surface-elevated hover:bg-surface-secondary" asChild>
                <Link href="/buddy">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Chat with Buddy
                </Link>
              </Button>
            </div>
          </div>
        </SanctuaryCard>

        {/* Wellbeing Snapshot */}
        <SanctuaryCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sage-50">
                <TrendingUp className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <h2 className="font-semibold text-text">Wellbeing Snapshot</h2>
                <p className="text-xs text-text-muted">Your recent journey</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700" asChild>
              <Link href="/journey">
                View Journey
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <SnapshotSkeleton />
          ) : moodTrendData.length > 0 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 rounded-xl bg-surface-secondary">
                  <p className="text-xs text-text-muted">Average Mood</p>
                  <p className="text-2xl font-semibold text-text mt-0.5">
                    {averageMood}
                    <span className="text-sm font-normal text-text-muted">/5</span>
                  </p>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-surface-secondary">
                  <p className="text-xs text-text-muted">Total Entries</p>
                  <p className="text-2xl font-semibold text-text mt-0.5">
                    {data?.recentMoods?.length ?? 0}
                  </p>
                </div>
              </div>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData}>
                    <XAxis dataKey="label" hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload;
                          return (
                            <div className="bg-surface-elevated border border-border rounded-card px-3 py-2 shadow-elevated text-xs">
                              <p className="font-medium text-text">{p.date}</p>
                              <p className="text-text-muted">
                                Mood: {p.rating} {getMoodEmoji(p.rating)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#0d9488"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 px-4">
              <div className="p-3 rounded-2xl bg-primary-50 mb-3">
                <Calendar className="w-6 h-6 text-primary-500" />
              </div>
              <p className="text-sm font-medium text-text">No entries yet</p>
              <p className="text-xs text-text-muted mt-1 max-w-xs">
                Log your first mood above to start seeing your personal wellbeing snapshot.
              </p>
            </div>
          )}
        </SanctuaryCard>
      </div>

      {/* Recent moods + Latest assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <SanctuaryCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text">Recent Moods</h2>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700" asChild>
              <Link href="/journey">See all</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : data?.recentMoods && data.recentMoods.length > 0 ? (
            <div className="space-y-2">
              {data.recentMoods.slice(0, 5).map((mood) => (
                <div
                  key={mood.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface-secondary"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{getMoodEmoji(mood.moodRating)}</span>
                    <span className="text-sm text-text">{getMoodLabelForRating(mood.moodRating)}</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {formatRelativeTime(mood.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-text-muted">
                No mood entries yet. Start tracking to see your progress here.
              </p>
            </div>
          )}
        </SanctuaryCard>

        {/* Latest Assessment */}
        <SanctuaryCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text">Latest PHQ-9</h2>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700" asChild>
              <Link href="/journey">Take again</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          ) : data?.latestAssessment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary">
                <span className="text-sm text-text-muted">Score</span>
                <span className="text-3xl font-semibold text-text">
                  {data.latestAssessment.totalScore}
                  <span className="text-base font-normal text-text-muted">/27</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Severity</span>
                <Badge className={getSeverityColor(data.latestAssessment.severityLevel)}>
                  {data.latestAssessment.severityLevel.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-text-muted">
                Taken {formatRelativeTime(data.latestAssessment.completedAt)}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-text-muted mb-3">
                You haven&apos;t taken an assessment yet.
              </p>
              <Button variant="outline" size="sm" className="border-border bg-surface-elevated hover:bg-surface-secondary" asChild>
                <Link href="/journey">Take Your First Assessment</Link>
              </Button>
            </div>
          )}
        </SanctuaryCard>
      </div>
    </div>
  );
}

function SnapshotSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 flex-1" />
        <Skeleton className="h-20 flex-1" />
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
