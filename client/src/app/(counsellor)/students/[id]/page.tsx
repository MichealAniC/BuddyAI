'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/students" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">
            Detailed student view for ID: <span className="font-mono">{id}</span>
          </p>
          <p className="text-sm text-neutral-400 mt-2">
            Full student profile with history, assessments, and mood data will be available when the backend endpoint is implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
