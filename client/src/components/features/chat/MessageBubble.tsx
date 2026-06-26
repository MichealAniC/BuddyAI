'use client';

import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatters';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: Message;
  userName?: string;
}

export function MessageBubble({ message, userName }: MessageBubbleProps) {
  const isUser = message.role === 'user';

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
              : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
          )}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-neutral-400 px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
