'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  useConversations,
  useMessages,
  useCreateConversation,
  useSendMessage,
} from '@/hooks/useChat';
import { MessageBubble } from '@/components/features/chat/MessageBubble';
import { ChatInput } from '@/components/features/chat/ChatInput';
import { TypingIndicator } from '@/components/features/chat/TypingIndicator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Plus } from 'lucide-react';
import { Conversation } from '@/types';

export default function BuddyPage() {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: convLoading } = useConversations();
  const { data: messages, isLoading: msgsLoading } = useMessages(activeConversationId);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage(activeConversationId);

  // Auto-select latest conversation
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendMessage.isPending]);

  const handleNewConversation = async () => {
    try {
      const conv = (await createConversation.mutateAsync()) as Conversation;
      setActiveConversationId(conv.id);
    } catch (e) {
      // Handle error silently
    }
  };

  const handleSend = (content: string) => {
    if (!activeConversationId) return;
    sendMessage.mutate(content);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-800">Buddy</h1>
          <p className="text-sm text-neutral-500">Your supportive AI companion</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewConversation}
          disabled={createConversation.isPending}
        >
          <Plus className="w-4 h-4 mr-1" />
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface-elevated">
        {convLoading || msgsLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-1/2 ml-auto" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        ) : !activeConversationId ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="p-4 rounded-2xl bg-primary-50 mb-4">
              <MessageCircle className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-lg font-medium text-neutral-700">Start a Conversation</h2>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">
              I&apos;m Buddy, your supportive AI companion. I&apos;m here to listen and help you
              navigate your feelings.
            </p>
            <Button
              className="mt-4"
              onClick={handleNewConversation}
              disabled={createConversation.isPending}
            >
              Start Chatting
            </Button>
          </div>
        ) : (
          <div className="flex flex-col p-4 space-y-4 min-h-full">
            {/* Welcome message if no messages */}
            {(!messages || messages.length === 0) && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-neutral-400">
                    Say hello! I&apos;m here to listen and support you.
                  </p>
                </div>
              </div>
            )}

            {messages?.map((msg) => (
              <MessageBubble key={msg.id} message={msg} userName={user?.fullName} />
            ))}

            {sendMessage.isPending && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      {activeConversationId && <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />}
    </div>
  );
}
