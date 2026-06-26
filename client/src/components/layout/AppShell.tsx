'use client';

import { ReactNode } from 'react';

interface AppShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, topbar, children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface-elevated">
        {sidebar}
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 md:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/80 backdrop-blur-sm">
          {topbar}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
