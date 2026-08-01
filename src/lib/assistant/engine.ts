import { ASSISTANT_CONFIG } from "./config";
import { AssistantApiError } from "./errors";
import type { LeadProfileDisplay } from "./lead-detection";
import type { ChatMessage } from "./types";

interface AssistantApiResponse {
  success: boolean;
  message?: string;
  lead?: LeadProfileDisplay | null;
  error?: string;
  code?: string;
}

export interface AssistantResponse {
  message: string;
  lead: LeadProfileDisplay | null;
}

function toApiMessages(
  history: ChatMessage[]
): Array<{ role: "user" | "assistant"; content: string }> {
  return history
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        message.status !== "error"
    )
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
    }));
}

/**
 * Sends the session conversation history to the server-side OpenAI route.
 * The API key never leaves the server.
 */
export async function generateAssistantResponse(
  _userMessage: string,
  history: ChatMessage[],
  sessionId?: string,
  locale?: string
): Promise<AssistantResponse> {
  const messages = toApiMessages(history);

  if (messages.length === 0) {
    throw new AssistantApiError("Keine Nachricht zum Senden vorhanden.");
  }

  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      ...(sessionId ? { sessionId } : {}),
      ...(locale ? { locale } : {}),
    }),
  });

  let data: AssistantApiResponse;

  try {
    data = (await response.json()) as AssistantApiResponse;
  } catch {
    throw new AssistantApiError(
      `Assistant-API antwortete nicht korrekt (HTTP ${response.status}).`
    );
  }

  if (!response.ok || !data.success || !data.message) {
    throw new AssistantApiError(
      data.error ?? `Assistant-API-Fehler (HTTP ${response.status}).`,
      data.code
    );
  }

  return {
    message: data.message,
    lead: data.lead ?? null,
  };
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Erzeugt eine stabile Session-ID für internes Lead-Scoring. */
export function createAssistantSessionId(): string {
  return `asst_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function createWelcomeMessage(content?: string): ChatMessage {
  return {
    id: createMessageId(),
    role: "assistant",
    content: content ?? ASSISTANT_CONFIG.welcomeMessage,
    timestamp: new Date(),
    status: "sent",
  };
}
