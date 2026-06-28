/**
 * LLM Orchestrator Service
 *
 * Builds the message payload for the LLM API call following the
 * Constitutional AI architecture. Handles:
 * - Dynamic tone injection based on sentiment
 * - Conversation history retrieval (last N turns)
 * - Structured message array construction
 * - LLM API execution with controlled temperature
 *
 * Falls back to deterministic sentiment-based responses when no LLM
 * API key is configured.
 */

import { config } from '../../config/env';
import {
  CONSTITUTIONAL_PROMPT,
  TONE_MODIFIERS,
} from './prompts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface LLMResponse {
  choices: LLMChoice[];
}

// ---------------------------------------------------------------------------
// Tone Helper
// ---------------------------------------------------------------------------

/**
 * Returns the appropriate tone modifier string based on the sentiment
 * of the user's latest message.
 *
 * - NEGATIVE  → Empathetic / Calming
 * - POSITIVE / NEUTRAL → High-Efficiency / Rapid-Execution
 */
export function getToneModifier(sentiment: string): string {
  if (sentiment === 'NEGATIVE') {
    return TONE_MODIFIERS.EMPATHETIC;
  }
  return TONE_MODIFIERS.HIGH_EFFICIENCY;
}

// ---------------------------------------------------------------------------
// Message Construction
// ---------------------------------------------------------------------------

/**
 * Builds the full message array for the LLM API call:
 *
 *  Index 0    → System prompt + dynamic tone directive
 *  Index 1–N  → Last `maxTurns` messages from conversation history
 *  Index N+1  → Current user input
 *
 * The system message is **always** the first element.
 */
export function buildMessagePayload(
  userInput: string,
  history: { sender: string; messageText: string }[],
  sentiment: string,
  maxTurns = 5
): LLMMessage[] {
  const toneModifier = getToneModifier(sentiment);

  // Index 0 — System
  const systemMessage: LLMMessage = {
    role: 'system',
    content: `${CONSTITUTIONAL_PROMPT}\n\n${toneModifier}`,
  };

  // Index 1–N — History (map Prisma rows to LLM roles)
  const historyMessages: LLMMessage[] = history
    .slice(-maxTurns)
    .map((msg) => ({
      role: (msg.sender === 'USER' ? 'user' : 'assistant') as LLMMessage['role'],
      content: msg.messageText,
    }));

  // Index N+1 — Current user input
  const userMessage: LLMMessage = {
    role: 'user',
    content: userInput,
  };

  return [systemMessage, ...historyMessages, userMessage];
}

// ---------------------------------------------------------------------------
// LLM Execution
// ---------------------------------------------------------------------------

/**
 * Calls the LLM API with the constructed message payload.
 *
 * Uses `temperature: 0.4` for structural determinism as specified
 * by the Constitutional AI architecture.
 *
 * If no API key is configured, returns `null` so the caller can
 * fall back to the deterministic sentiment-based response.
 */
export async function callLLM(messages: LLMMessage[]): Promise<string | null> {
  if (!config.openaiApiKey) {
    // No LLM configured — signal fallback
    return null;
  }

  const baseUrl = config.openaiBaseUrl || 'https://api.openai.com/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: config.openaiModel,
      messages,
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as LLMResponse;

  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('LLM API returned empty response');
  }

  return choice.message.content;
}

// ---------------------------------------------------------------------------
// High-level Orchestrator
// ---------------------------------------------------------------------------

/**
 * Full orchestration pipeline:
 * 1. Build message payload with tone + history
 * 2. Call LLM API
 * 3. Return response text (or null for fallback)
 */
export async function generateResponse(
  userInput: string,
  history: { sender: string; messageText: string }[],
  sentiment: string
): Promise<string | null> {
  const messages = buildMessagePayload(userInput, history, sentiment);

  // Guarantee: system message is always first
  if (messages[0].role !== 'system') {
    throw new Error('Constitutional AI violation: system message must be index 0');
  }

  return callLLM(messages);
}
