'use client';

import { PublicNav } from '@/components/layout/PublicNav';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <PublicNav />
      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Soft decorative gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_theme(colors.primary.100)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_theme(colors.secondary.100)_0%,_transparent_55%)]"
        />
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t border-border/50 bg-surface-elevated/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-neutral-400">
          Your data is encrypted, private, and never shared. &nbsp;·&nbsp; © {new Date().getFullYear()} BuddyAI
        </div>
      </footer>
    </div>
  );
}
