'use client';

import { useToast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-card shadow-elevated text-sm font-medium border',
              toast.type === 'success' && 'bg-sage-50 text-sage-800 border-sage-200',
              toast.type === 'error' && 'bg-rose-50 text-rose-800 border-rose-200',
              toast.type === 'warning' && 'bg-amber-50 text-amber-800 border-amber-200',
              toast.type === 'info' && 'bg-primary-50 text-primary-800 border-primary-200'
            )}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-0.5 rounded hover:bg-black/5 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
