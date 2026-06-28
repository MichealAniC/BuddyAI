'use client';

import { useState } from 'react';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { moodService } from '@/services/moodService';
import { getMoodEmoji, getMoodLabel } from '@/utils/formatters';
import { Loader2, Smile } from 'lucide-react';

interface MoodLoggerProps {
  onLogged?: () => void;
  className?: string;
}

export function MoodLogger({ onLogged, className }: MoodLoggerProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (rating === null) {
      showToast('Please select a mood rating first.', 'error');
      return;
    }

    setStatus('loading');

    try {
      await moodService.logMood(rating, notes);
      setStatus('success');
      showToast('Mood logged successfully!', 'success');

      // Reset form after a short success beat
      setTimeout(() => {
        setRating(null);
        setNotes('');
        setStatus('idle');
      }, 1200);

      // Notify parent dashboard to refresh data
      onLogged?.();
    } catch (error) {
      setStatus('idle');
      const message = error instanceof Error ? error.message : 'Failed to log mood.';
      showToast(message, 'error');
    }
  };

  const isSubmitDisabled = rating === null || status === 'loading' || status === 'success';

  return (
    <SanctuaryCard className={cn('p-6', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-primary-50">
          <Smile className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">Daily Mood Logger</h3>
          <p className="text-xs text-neutral-500">How are you feeling right now?</p>
        </div>
      </div>

      {/* 5-point emoji rating scale */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            disabled={status === 'loading' || status === 'success'}
            aria-label={`Rate mood ${value} out of 5: ${getMoodLabel(value)}`}
            className={cn(
              'flex flex-col items-center gap-1 p-2 sm:p-3 rounded-2xl transition-all duration-200 min-w-[56px] sm:min-w-[64px]',
              rating === value
                ? 'bg-primary-50 border-2 border-primary-300 scale-110 shadow-sm'
                : 'bg-neutral-50 border-2 border-transparent hover:bg-neutral-100 hover:scale-105'
            )}
          >
            <span className="text-2xl sm:text-3xl">{getMoodEmoji(value)}</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">
              {getMoodLabel(value)}
            </span>
          </button>
        ))}
      </div>

      {/* Optional notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note (optional)..."
        disabled={status === 'loading' || status === 'success'}
        rows={2}
        className="w-full rounded-[12px] border border-border bg-white/80 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 resize-none mb-4 disabled:opacity-60"
      />

      {/* Submit button with state feedback */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className={cn(
          'w-full transition-all duration-200',
          status === 'success' && 'bg-green-600 hover:bg-green-700'
        )}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : status === 'success' ? (
          'Mood Logged'
        ) : (
          'Log Mood'
        )}
      </Button>
    </SanctuaryCard>
  );
}
