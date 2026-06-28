'use client';

import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComingSoonProps {
  featureName: string;
  className?: string;
}

export function ComingSoon({ featureName, className }: ComingSoonProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-6',
        className
      )}
    >
      <div className="p-5 rounded-3xl bg-primary-50 mb-6">
        <Rocket className="w-12 h-12 text-primary-500" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-800 mb-3">
        {featureName} Coming Soon
      </h1>

      <p className="text-sm sm:text-base text-neutral-500 max-w-md leading-relaxed">
        We&apos;re building something great for you. This feature is currently
        under development and will be available in a future update.
      </p>
    </div>
  );
}
