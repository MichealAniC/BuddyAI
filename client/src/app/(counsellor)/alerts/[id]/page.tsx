'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlert, useAlertStudent, useUpdateAlert } from '@/hooks/useAlerts';
import { useToast } from '@/hooks/useToast';
import { getRiskColor, getAlertStatusColor } from '@/utils/colors';
import { formatDateTime } from '@/utils/formatters';
import { ArrowLeft, User, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AlertDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  const { data: alert, isLoading } = useAlert(id);
  const { data: student } = useAlertStudent(id);
  const updateAlert = useUpdateAlert(id);

  const handleStatusUpdate = (status: string) => {
    updateAlert.mutate({ status }, {
      onSuccess: () => showToast(`Alert marked as ${status.toLowerCase()}`, 'success'),
      onError: () => showToast('Failed to update alert', 'error'),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-neutral-500">Alert not found.</p>
        <Link href="/alerts"><Button variant="outline" className="mt-4">Back to Alerts</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/alerts" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </Link>

      {/* Alert Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-neutral-500" />
              Risk Alert Detail
            </CardTitle>
            <Badge className={getAlertStatusColor(alert.status)}>
              {alert.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="py-2 px-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Risk Level</p>
              <Badge className={`mt-1 ${getRiskColor(alert.riskLevel)}`}>
                {alert.riskLevel}
              </Badge>
            </div>
            <div className="py-2 px-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Created</p>
              <p className="text-sm font-medium text-neutral-700 mt-1">{formatDateTime(alert.createdAt)}</p>
            </div>
          </div>

          {alert.triggers && alert.triggers.length > 0 && (
            <div className="py-2 px-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500 mb-2">Triggers</p>
              <div className="flex flex-wrap gap-1.5">
                {alert.triggers.map((trigger, i) => (
                  <Badge key={i} variant="default">{trigger}</Badge>
                ))}
              </div>
            </div>
          )}

          {alert.notes && (
            <div className="py-2 px-3 rounded-[10px] bg-neutral-50">
              <p className="text-xs text-neutral-500">Notes</p>
              <p className="text-sm text-neutral-700 mt-1">{alert.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          {alert.status === 'PENDING' && (
            <Button onClick={() => handleStatusUpdate('REVIEWED')} disabled={updateAlert.isPending} variant="outline">
              <Eye className="w-4 h-4 mr-1" /> Mark Reviewed
            </Button>
          )}
          {alert.status !== 'RESOLVED' && (
            <Button onClick={() => handleStatusUpdate('RESOLVED')} disabled={updateAlert.isPending}>
              <CheckCircle className="w-4 h-4 mr-1" /> Resolve
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Student Info */}
      {student && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-neutral-500" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-neutral-50">
              <span className="text-sm text-neutral-500">Name</span>
              <span className="text-sm font-medium text-neutral-700">{(student as any).fullName || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-neutral-50">
              <span className="text-sm text-neutral-500">Email</span>
              <span className="text-sm font-medium text-neutral-700">{(student as any).email || '—'}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
