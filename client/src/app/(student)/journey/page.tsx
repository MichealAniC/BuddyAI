'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMoodEntries, useCreateMood } from '@/hooks/useMood';
import { useAssessments, useSubmitAssessment } from '@/hooks/useAssessment';
import { MoodSelector } from '@/components/features/mood/MoodSelector';
import { MoodChart } from '@/components/features/mood/MoodChart';
import { Phq9Form } from '@/components/features/assessment/Phq9Form';
import { getMoodEmoji, formatRelativeTime } from '@/utils/formatters';
import { getSeverityColor } from '@/utils/colors';
import { useToast } from '@/hooks/useToast';
import { TrendingUp, ClipboardList } from 'lucide-react';

export default function JourneyPage() {
  const [activeTab, setActiveTab] = useState<'mood' | 'assessment'>('mood');
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);

  const { data: moods, isLoading: moodsLoading } = useMoodEntries();
  const { data: assessments, isLoading: assessmentsLoading } = useAssessments();
  const createMood = useCreateMood();
  const submitAssessment = useSubmitAssessment();
  const { showToast } = useToast();

  const handleMoodSubmit = (rating: number, notes?: string) => {
    createMood.mutate(
      { rating, notes },
      {
        onSuccess: () => showToast('Mood logged successfully!', 'success'),
        onError: () => showToast('Failed to log mood. Please try again.', 'error'),
      }
    );
  };

  const handleAssessmentSubmit = (answers: number[]) => {
    submitAssessment.mutate(answers, {
      onSuccess: () => {
        showToast('Assessment submitted!', 'success');
        setShowAssessmentForm(false);
      },
      onError: () => showToast('Failed to submit assessment.', 'error'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Your Journey</h1>
        <p className="mt-1 text-neutral-500">
          Track your wellbeing and see your progress over time.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-neutral-100 rounded-[10px] w-fit">
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-all ${
            activeTab === 'mood'
              ? 'bg-surface-elevated shadow-card text-neutral-800'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Mood
        </button>
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-all ${
            activeTab === 'assessment'
              ? 'bg-surface-elevated shadow-card text-neutral-800'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Assessment
        </button>
      </div>

      {activeTab === 'mood' && (
        <div className="space-y-6">
          {/* Log Mood */}
          <Card>
            <CardHeader>
              <CardTitle>Log Your Mood</CardTitle>
              <CardDescription>Take a moment to check in with yourself.</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodSelector onSubmit={handleMoodSubmit} disabled={createMood.isPending} />
            </CardContent>
          </Card>

          {/* Mood Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your mood over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {moodsLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <MoodChart data={moods || []} />
              )}
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {moodsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : moods && moods.length > 0 ? (
                <div className="space-y-2">
                  {moods.slice(0, 10).map((mood) => (
                    <div
                      key={mood.id}
                      className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getMoodEmoji(mood.rating)}</span>
                        <div>
                          <p className="text-sm font-medium text-neutral-700">{mood.rating}/5</p>
                          {mood.notes && (
                            <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                              {mood.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {formatRelativeTime(mood.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">No entries yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {showAssessmentForm ? (
            <Card>
              <CardHeader>
                <CardTitle>PHQ-9 Assessment</CardTitle>
                <CardDescription>
                  Please answer honestly — there are no wrong answers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Phq9Form
                  onSubmit={handleAssessmentSubmit}
                  disabled={submitAssessment.isPending}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center text-center py-8">
                <div className="p-3 rounded-2xl bg-blue-50 mb-3">
                  <ClipboardList className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-medium text-neutral-800">PHQ-9 Wellbeing Check</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-sm">
                  A brief questionnaire to help understand how you&apos;ve been feeling over the
                  past two weeks.
                </p>
                <Button className="mt-4" onClick={() => setShowAssessmentForm(true)}>
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Past Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : assessments && assessments.length > 0 ? (
                <div className="space-y-2">
                  {assessments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between py-3 px-3 rounded-[10px] bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-neutral-700">
                          {a.totalScore}/27
                        </span>
                        <Badge className={getSeverityColor(a.severity)}>
                          {a.severity.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {formatRelativeTime(a.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">
                  No assessments taken yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
