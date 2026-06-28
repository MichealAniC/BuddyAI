import prisma from '../config/prisma';
import { analyzeSentiment } from './nlp.service';
import { generateResponse } from '../lib/ai/llm.service';

type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

function mapSentiment(sentiment: string): Sentiment {
  switch (sentiment) {
    case 'positive': return 'POSITIVE';
    case 'negative': return 'NEGATIVE';
    default: return 'NEUTRAL';
  }
}

/**
 * Deterministic fallback â€” used when no LLM API key is configured
 * or when the LLM call fails. Preserves the original sentiment-based
 * response behaviour.
 */
function fallbackResponse(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'POSITIVE':
      return "That's wonderful to hear! It sounds like things are going well. Keep nurturing those positive moments â€” they matter more than you might think.";
    case 'NEGATIVE':
      return "I hear you, and I want you to know that your feelings are valid. It's okay to not be okay sometimes. Would you like to talk more about what's on your mind, or would you prefer some coping strategies that might help?";
    default:
      return "Thank you for sharing. How are you feeling overall today? I'm here to listen whenever you'd like to talk about anything.";
  }
}

export async function createConversation(userId: number) {
  return prisma.conversation.create({
    data: { userId },
  });
}

export async function getUserConversations(userId: number) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function sendMessage(conversationId: number, userId: number, messageText: string) {
  // 1. Verify conversation belongs to user
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conversation) {
    throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
  }

  // 2. Analyse sentiment via NLP service
  let sentiment: Sentiment = 'NEUTRAL';
  let sentimentScore: number = 0;

  try {
    const nlpResult = await analyzeSentiment(messageText);
    sentiment = mapSentiment(nlpResult.sentiment);
    sentimentScore = nlpResult.compound_score;
  } catch (error) {
    // NLP service unavailable â€” continue with neutral default
    console.error('NLP service unavailable:', error);
  }

  // 3. Store user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      messageText,
      sender: 'USER',
      sentiment,
      sentimentScore,
    },
  });

  // 4. Retrieve conversation history (last 5 turns, excluding the just-created user msg)
  const history = await prisma.message.findMany({
    where: { conversationId, id: { not: userMessage.id } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { sender: true, messageText: true },
  });

  // Reverse to chronological order for the LLM context window
  const chronologicalHistory = history.reverse().map((m) => ({
    sender: m.sender,
    messageText: m.messageText,
  }));

  // 5. Generate bot response via Constitutional AI orchestrator
  let botResponseText: string;

  try {
    const llmResponse = await generateResponse(messageText, chronologicalHistory, sentiment);
    botResponseText = llmResponse ?? fallbackResponse(sentiment);
  } catch (error) {
    console.error('LLM orchestration failed, using fallback:', error);
    botResponseText = fallbackResponse(sentiment);
  }

  // 6. Store bot message
  const botMessage = await prisma.message.create({
    data: {
      conversationId,
      messageText: botResponseText,
      sender: 'BOT',
    },
  });

  return { userMessage, botMessage };
}

export async function getConversationMessages(conversationId: number, userId: number) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conversation) {
    throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
  }

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}
