'use client';

import { useToast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-[10px] shadow-elevated text-sm font-medium transition-all duration-200',
            toast.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
            toast.type === 'error' && 'bg-red-50 text-red-800 border border-red-200',
            toast.type === 'warning' && 'bg-yellow-50 text-yellow-800 border border-yellow-200',
            toast.type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200',
          )}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-0.5 rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
