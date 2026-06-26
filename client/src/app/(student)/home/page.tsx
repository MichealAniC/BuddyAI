'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, TrendingUp, ClipboardList, Sparkles } from 'lucide-react';
import { getMoodEmoji, getMoodLabel, formatRelativeTime } from '@/utils/formatters';
import { getSeverityColor } from '@/utils/colors';
import Link from 'next/link';

const wellnessTips = [
  "Take a few deep breaths. You're doing great just by being here.",
  "Remember: progress isn't always linear, and that's perfectly okay.",
  "A short walk outside can do wonders for your mental clarity.",
  "It's okay to not be okay. What matters is that you're here.",
  "Small steps count. Celebrate your progress, no matter how small.",
];

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  const tip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-neutral-500">
          How are you feeling today? We&apos;re here for you.
        </p>
      </div>

      {/* Wellness Tip */}
      <Card className="bg-primary-50 border-primary-100">
        <CardContent className="flex items-start gap-3 py-4">
          <div className="p-2 rounded-xl bg-primary-100">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-700">Daily Wellness Thought</p>
            <p className="text-sm text-primary-600 mt-0.5">{tip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/buddy">
          <Card className="hover:shadow-elevated transition-shadow duration-200 cursor-pointer group h-full">
            <CardContent className="flex flex-col items-center text-center py-6 gap-3">
              <div className="p-3 rounded-2xl bg-primary-50 group-hover:bg-primary-100 transition-colors">
                <MessageCircle className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">Talk to Buddy</p>
                <p className="text-xs text-neutral-500 mt-0.5">Chat with your AI companion</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journey">
          <Card className="hover:shadow-elevated transition-shadow duration-200 cursor-pointer group h-full">
            <CardContent className="flex flex-col items-center text-center py-6 gap-3">
              <div className="p-3 rounded-2xl bg-secondary-50 group-hover:bg-secondary-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-secondary-500" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">Log Mood</p>
                <p className="text-xs text-neutral-500 mt-0.5">Track how you&apos;re feeling</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journey">
          <Card className="hover:shadow-elevated transition-shadow duration-200 cursor-pointer group h-full">
            <CardContent className="flex flex-col items-center text-center py-6 gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <ClipboardList className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">Take Assessment</p>
                <p className="text-xs text-neutral-500 mt-0.5">Check in with yourself</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Mood + Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Moods</CardTitle>
            <CardDescription>Your mood over the past entries</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : data?.recentMoods && data.recentMoods.length > 0 ? (
              <div className="space-y-2">
                {data.recentMoods.slice(0, 5).map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMoodEmoji(mood.rating)}</span>
                      <span className="text-sm text-neutral-700">{getMoodLabel(mood.rating)}</span>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {formatRelativeTime(mood.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-4">
                No mood entries yet. Start tracking to see your progress here.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Latest Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Assessment</CardTitle>
            <CardDescription>Your most recent PHQ-9 result</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            ) : data?.latestAssessment ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Score</span>
                  <span className="text-2xl font-semibold text-neutral-800">
                    {data.latestAssessment.totalScore}/27
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Severity</span>
                  <Badge className={getSeverityColor(data.latestAssessment.severity)}>
                    {data.latestAssessment.severity.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-neutral-400">
                    Taken {formatRelativeTime(data.latestAssessment.createdAt)}
                  </span>
                </div>
                <Link href="/journey">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Take Again
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-400 mb-3">
                  You haven&apos;t taken an assessment yet.
                </p>
                <Link href="/journey">
                  <Button variant="outline" size="sm">Take Your First Assessment</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
