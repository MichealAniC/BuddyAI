'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { studentNavItems } from '@/constants/navigation';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && user?.role !== 'STUDENT') {
      router.push('/overview');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'STUDENT') {
    return null;
  }

  return (
    <>
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Sidebar items={studentNavItems} title="BuddyAI" subtitle="Your wellness companion" />
      </MobileSidebar>
      <AppShell
        sidebar={<Sidebar items={studentNavItems} title="BuddyAI" subtitle="Your wellness companion" />}
        topbar={<TopBar onMenuToggle={() => setMobileMenuOpen(true)} />}
      >
        {children}
      </AppShell>
    </>
  );
}
