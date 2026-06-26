'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getMoodEmoji, getMoodLabel } from '@/utils/formatters';

interface MoodSelectorProps {
  onSubmit: (rating: number, notes?: string) => void;
  disabled?: boolean;
}

export function MoodSelector({ onSubmit, disabled }: MoodSelectorProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (rating === null) return;
    onSubmit(rating, notes || undefined);
    setRating(null);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">How are you feeling right now?</p>
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 min-w-[60px]',
              rating === value
                ? 'bg-primary-50 border-2 border-primary-300 scale-110'
                : 'bg-neutral-50 border-2 border-transparent hover:bg-neutral-100 hover:scale-105'
            )}
          >
            <span className="text-2xl">{getMoodEmoji(value)}</span>
            <span className="text-[10px] text-neutral-500 font-medium">{getMoodLabel(value)}</span>
          </button>
        ))}
      </div>
      {rating !== null && (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note about how you're feeling (optional)..."
            className="w-full rounded-[10px] border border-border bg-neutral-50 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none h-20"
          />
          <Button onClick={handleSubmit} disabled={disabled} className="w-full">
            Log Mood
          </Button>
        </div>
      )}
    </div>
  );
}
