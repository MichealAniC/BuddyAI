'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { useAlert, useAlertStudent, useUpdateAlert } from '@/hooks/useAlerts';
import { useToast } from '@/hooks/useToast';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';
import { getMoodEmojiForRating, getMoodLabelForRating } from '@/utils/moodMapping';
import { AlertStatus } from '@/types';
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Calendar,
  StickyNote,
  Clock,
  History,
  Save,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS: { value: AlertStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'FOLLOW_UP_SCHEDULED', label: 'Follow-up Scheduled' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export default function AlertDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  const { data: alert, isLoading: alertLoading } = useAlert(id);
  const { data: student, isLoading: studentLoading } = useAlertStudent(id);
  const updateAlert = useUpdateAlert(id);

  const [status, setStatus] = useState<AlertStatus>('PENDING');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  useEffect(() => {
    if (alert) {
      setStatus(alert.status);
      setNotes(alert.notes || '');
      setFollowUpDate(alert.followUpDate ? alert.followUpDate.slice(0, 10) : '');
    }
  }, [alert]);

  const handleSave = () => {
    updateAlert.mutate(
      {
        status,
        notes,
        followUpDate: followUpDate || null,
      },
      {
        onSuccess: () => {
          showToast('Alert updated successfully', 'success');
          const timestamp = new Date().toLocaleString();
          const actions: string[] = [];
          if (status) actions.push(`Status changed to ${status.replace(/_/g, ' ')}`);
          if (notes) actions.push('Notes updated');
          if (followUpDate) actions.push(`Follow-up scheduled for ${followUpDate}`);
          if (actions.length > 0) {
            setActionHistory((prev) => [`${timestamp}: ${actions.join(', ')}`, ...prev]);
          }
        },
        onError: () => showToast('Failed to update alert', 'error'),
      }
    );
  };

  if (alertLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <p className="text-neutral-500">Alert not found.</p>
        <Link href="/alerts">
          <Button variant="outline" className="mt-4">Back to Alerts</Button>
        </Link>
      </div>
    );
  }

  const user = (student as any)?.user;
  const latestAssessment = (student as any)?.latestAssessment;
  const moodSummary = (student as any)?.moodSummary;
  const historicalAlerts = (student as any)?.historicalAlerts || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/alerts" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </Link>

      {/* Header */}
      <SanctuaryCard>
        <CardHeader className="p-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-neutral-500" />
                <CardTitle>Alert Workspace</CardTitle>
              </div>
              <p className="text-sm text-neutral-500">
                {user?.fullName || 'Unknown Student'} • {user?.email || '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(alert.riskLevel)}>{alert.riskLevel}</Badge>
              <Badge className={getAlertStatusColor(alert.status)}>{alert.status.replace(/_/g, ' ')}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Created</p>
              <p className="text-sm font-medium text-neutral-700 mt-1">{formatDateTime(alert.createdAt)}</p>
            </div>
            <div className="p-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Student</p>
              <p className="text-sm font-medium text-neutral-700 mt-1">
                {user?.gender || '—'} • {user?.age ? `${user.age} years` : '—'}
              </p>
            </div>
            <div className="p-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Last Updated</p>
              <p className="text-sm font-medium text-neutral-700 mt-1">
                {alert.updatedAt ? formatRelativeTime(alert.updatedAt) : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </SanctuaryCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Data Analysis */}
        <div className="space-y-6">
          {/* PHQ-9 Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PHQ-9 Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {latestAssessment ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-50">
                    <span className="text-sm text-neutral-500">Total Score</span>
                    <span className="text-lg font-semibold text-neutral-800">
                      {latestAssessment.totalScore}/27
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-50">
                    <span className="text-sm text-neutral-500">Severity</span>
                    <Badge className={getSeverityColor(latestAssessment.severityLevel)}>
                      {latestAssessment.severityLevel.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400 text-right">
                    Completed {formatRelativeTime(latestAssessment.completedAt)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">No PHQ-9 assessment available.</p>
              )}
            </CardContent>
          </Card>

          {/* Mood Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Mood Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {moodSummary?.recentEntries && moodSummary.recentEntries.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                    <span>Average: <strong className="text-neutral-700">{moodSummary.average}</strong></span>
                    <span>{moodSummary.recentEntries.length} entries</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {moodSummary.recentEntries.slice(0, 10).map((entry: any) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2 rounded-[10px] bg-neutral-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getMoodEmojiForRating(entry.moodRating)}</span>
                          <span className="text-sm text-neutral-700">
                            {getMoodLabelForRating(entry.moodRating)}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {formatRelativeTime(entry.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">No mood entries available.</p>
              )}
            </CardContent>
          </Card>

          {/* Historical Alert Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Alert Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historicalAlerts.length > 0 ? (
                <div className="space-y-3">
                  {historicalAlerts.map((historicalAlert: any) => (
                    <div key={historicalAlert.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-400" />
                        <div className="w-0.5 flex-1 bg-neutral-200 my-1" />
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(historicalAlert.riskLevel)}>
                            {historicalAlert.riskLevel}
                          </Badge>
                          <Badge className={getAlertStatusColor(historicalAlert.status)}>
                            {historicalAlert.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          {formatDateTime(historicalAlert.createdAt)}
                        </p>
                        {historicalAlert.assessment && (
                          <p className="text-xs text-neutral-500 mt-1">
                            PHQ-9: {historicalAlert.assessment.totalScore}/27
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">No previous alerts.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Intervention Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as AlertStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpDate" className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Follow-up Date
                </Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-1">
                  <StickyNote className="w-3.5 h-3.5" />
                  Counsellor Notes
                </Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your observations and intervention plan..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-[10px] border border-border bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 resize-y"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSave}
                disabled={updateAlert.isPending}
                className="w-full bg-primary-500 hover:bg-primary-600"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {updateAlert.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          {/* Action History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Action History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actionHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {actionHistory.map((entry, index) => (
                    <div key={index} className="p-3 rounded-[10px] bg-neutral-50 text-sm text-neutral-700">
                      {entry}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">
                  No actions recorded yet. Save changes to log them.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow label="Name" value={user?.fullName || '—'} />
              <InfoRow label="Email" value={user?.email || '—'} />
              <InfoRow label="Gender" value={user?.gender || '—'} />
              <InfoRow label="Age" value={user?.age ? String(user.age) : '—'} />
              <InfoRow label="Registered" value={user?.createdAt ? formatRelativeTime(user.createdAt) : '—'} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-neutral-50">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-700">{value}</span>
    </div>
  );
}

// Import helper for severity colors
function getSeverityColor(level: string): string {
  const colors: Record<string, string> = {
    MINIMAL: 'text-green-600 bg-green-50 border-green-200',
    MILD: 'text-blue-600 bg-blue-50 border-blue-200',
    MODERATE: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    MODERATELY_SEVERE: 'text-orange-600 bg-orange-50 border-orange-200',
    SEVERE: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[level] || colors.MINIMAL;
}
