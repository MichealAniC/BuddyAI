import prisma from '../config/prisma';
import { analyzeSentiment } from './nlp.service';

type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
type Sender = 'USER' | 'BOT';

function mapSentiment(sentiment: string): Sentiment {
  switch (sentiment) {
    case 'positive': return 'POSITIVE';
    case 'negative': return 'NEGATIVE';
    default: return 'NEUTRAL';
  }
}

function generateBotResponse(sentiment: Sentiment, sentimentScore: number): string {
  switch (sentiment) {
    case 'POSITIVE':
      return "That's wonderful to hear! It sounds like things are going well. Keep nurturing those positive moments — they matter more than you might think.";
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
  // Verify conversation belongs to user
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conversation) {
    throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
  }

  // Analyze sentiment via NLP service
  let sentiment: Sentiment = 'NEUTRAL';
  let sentimentScore: number = 0;

  try {
    const nlpResult = await analyzeSentiment(messageText);
    sentiment = mapSentiment(nlpResult.sentiment);
    sentimentScore = nlpResult.compound_score;
  } catch (error) {
    // If NLP service is unavailable, continue without sentiment
    console.error('NLP service unavailable:', error);
  }

  // Store user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      messageText,
      sender: 'USER',
      sentiment,
      sentimentScore,
    },
  });

  // Generate and store bot response
  const botResponseText = generateBotResponse(sentiment, sentimentScore);
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
  // Verify conversation belongs to user
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
