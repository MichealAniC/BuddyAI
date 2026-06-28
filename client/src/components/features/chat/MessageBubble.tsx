'use client';

import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatters';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: Message;
  userName?: string;
}

const sentimentStyles: Record<string, string> = {
  POSITIVE: 'bg-sage-50 text-sage-700 border-sage-200',
  NEGATIVE: 'bg-red-50 text-red-600 border-red-200',
  NEUTRAL: 'bg-neutral-50 text-neutral-500 border-neutral-200',
};

export function MessageBubble({ message, userName }: MessageBubbleProps) {
  const isUser = message.sender === 'USER';

  return (
    <div className={cn('flex gap-3 max-w-[85%]', isUser ? 'ml-auto flex-row-reverse' : '')}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            'text-xs',
            isUser ? 'bg-primary-100 text-primary-700' : 'bg-secondary-50 text-secondary-700'
          )}
        >
          {isUser ? (userName?.charAt(0) || 'U') : 'B'}
        </AvatarFallback>
      </Avatar>
      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-sage-50 text-neutral-800 border border-sage-100 rounded-bl-md'
          )}
        >
          {message.messageText}
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] text-neutral-400">
            {formatTime(message.createdAt)}
          </span>
          {message.sentiment && message.sentiment !== 'NEUTRAL' && (
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                sentimentStyles[message.sentiment] || sentimentStyles.NEUTRAL
              )}
            >
              {message.sentiment === 'POSITIVE' ? '😊 Positive' : '😔 Negative'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
