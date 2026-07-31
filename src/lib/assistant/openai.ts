import "server-only";

import OpenAI, { APIError } from "openai";
import {
  getOpenAIApiKey,
  getOpenAIMaxTokens,
  getOpenAIModel,
  isOpenAIConfigured,
} from "@/lib/env.server";
import { AssistantServiceError } from "./errors";
import { buildAssistantSystemPrompt } from "./system-prompt";
import type { AssistantRequest } from "./validation";

const MAX_HISTORY_MESSAGES = 20;

let openaiClient: OpenAI | null = null;
let openaiClientKey: string | null = null;

function getOpenAIClient(): OpenAI {
  const apiKey = getOpenAIApiKey();

  if (!isOpenAIConfigured()) {
    console.error(
      "[assistant] OPENAI_API_KEY is missing or still uses a placeholder value in .env.local"
    );
    throw new AssistantServiceError(
      "OPENAI_API_KEY fehlt in .env.local. Bitte den Schlüssel hinzufügen und den Dev-Server neu starten.",
      "OPENAI_NOT_CONFIGURED",
      503
    );
  }

  if (!openaiClient || openaiClientKey !== apiKey) {
    openaiClient = new OpenAI({ apiKey });
    openaiClientKey = apiKey;
  }

  return openaiClient;
}

function trimConversationHistory(
  messages: AssistantRequest["messages"]
): AssistantRequest["messages"] {
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

export async function generateOpenAIResponse(
  messages: AssistantRequest["messages"]
): Promise<string> {
  const client = getOpenAIClient();
  const trimmedMessages = trimConversationHistory(messages);
  const model = getOpenAIModel();
  const maxTokens = getOpenAIMaxTokens();

  try {
    const completion = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      messages: [
        { role: "system", content: buildAssistantSystemPrompt() },
        ...trimmedMessages,
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new AssistantServiceError(
        "Keine Antwort vom KI-Dienst erhalten. Bitte versuchen Sie es erneut.",
        "EMPTY_RESPONSE",
        502
      );
    }

    return content;
  } catch (error) {
    if (error instanceof AssistantServiceError) {
      throw error;
    }

    if (error instanceof APIError) {
      console.error("[assistant] OpenAI API error:", error.status, error.message);

      if (error.status === 401) {
        throw new AssistantServiceError(
          "OpenAI API-Schlüssel ungültig. Bitte OPENAI_API_KEY in .env.local prüfen.",
          "OPENAI_AUTH_ERROR",
          503
        );
      }

      if (error.status === 429) {
        throw new AssistantServiceError(
          "Der KI-Assistant ist gerade ausgelastet. Bitte versuchen Sie es in wenigen Sekunden erneut.",
          "OPENAI_RATE_LIMIT",
          429
        );
      }

      throw new AssistantServiceError(
        `OpenAI-Anfrage fehlgeschlagen (${error.status ?? "unknown"}): ${error.message}`,
        "OPENAI_ERROR",
        502
      );
    }

    console.error("[assistant] Unexpected OpenAI error:", error);
    throw new AssistantServiceError(
      error instanceof Error
        ? error.message
        : "Unbekannter Fehler bei der OpenAI-Anfrage.",
      "OPENAI_ERROR",
      502
    );
  }
}
