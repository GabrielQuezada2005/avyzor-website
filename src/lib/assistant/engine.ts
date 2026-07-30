import { ASSISTANT_CONFIG } from "./config";
import type { AssistantIntent, ChatMessage } from "./types";

const TYPING_DELAY_MIN_MS = 600;
const TYPING_DELAY_MAX_MS = 1400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomTypingDelay(): number {
  return (
    TYPING_DELAY_MIN_MS +
    Math.random() * (TYPING_DELAY_MAX_MS - TYPING_DELAY_MIN_MS)
  );
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

function matchIntent(
  userMessage: string,
  intents: AssistantIntent[]
): AssistantIntent | null {
  const normalized = normalizeText(userMessage);

  let bestMatch: AssistantIntent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (normalized.includes(normalizeText(keyword))) {
        score += keyword.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

function pickFallbackResponse(): string {
  const { fallbackResponses } = ASSISTANT_CONFIG;
  const index = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[index];
}

export interface GenerateResponseOptions {
  simulateTyping?: boolean;
}

/**
 * Rule-based response engine – placeholder for future AI integration.
 * No external API calls, no API keys required.
 */
export async function generateAssistantResponse(
  userMessage: string,
  _history: ChatMessage[],
  options: GenerateResponseOptions = {}
): Promise<string> {
  const { simulateTyping = true } = options;

  if (simulateTyping) {
    await delay(randomTypingDelay());
  }

  const intent = matchIntent(userMessage, ASSISTANT_CONFIG.intents);
  return intent ? intent.response : pickFallbackResponse();
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createWelcomeMessage(): ChatMessage {
  return {
    id: createMessageId(),
    role: "assistant",
    content: ASSISTANT_CONFIG.welcomeMessage,
    timestamp: new Date(),
    status: "sent",
  };
}
