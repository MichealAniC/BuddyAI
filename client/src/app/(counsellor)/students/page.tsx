'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { counsellorService, StudentDirectoryItem } from '@/services/counsellorService';
import { Search, User, Users, ClipboardList, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  const { data: students, isLoading } = useQuery<StudentDirectoryItem[]>({
    queryKey: ['students'],
    queryFn: () => counsellorService.getCounsellorStudents(),
  });
  const [search, setSearch] = useState('');

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  }, [students, search]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Student Directory</h1>
        <p className="mt-1 text-neutral-500">Browse and manage registered students.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <SanctuaryCard>
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{student.fullName}</p>
                    <p className="text-xs text-neutral-500">{student.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      <span>{student.gender || '—'}</span>
                      <span>•</span>
                      <span>{student.age ? `${student.age} years` : '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{student._count?.riskAlerts ?? 0} alerts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>{student._count?.assessments ?? 0} assessments</span>
                  </div>
                  <Link href={`/students/${student.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState hasSearch={!!search.trim()} />
        )}
      </SanctuaryCard>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="p-4 rounded-2xl bg-primary-50 mb-3">
        <Users className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-medium text-neutral-800">
        {hasSearch ? 'No students match your search' : 'No students registered yet'}
      </h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs">
        {hasSearch
          ? 'Try adjusting your search terms.'
          : 'Once students create accounts, they will appear here.'}
      </p>
    </div>
  );
}