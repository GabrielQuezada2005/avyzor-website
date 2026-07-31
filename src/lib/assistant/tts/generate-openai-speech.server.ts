import "server-only";

import OpenAI, { APIError } from "openai";
import {
  getOpenAIApiKey,
  getOpenAITtsModel,
  isOpenAIConfigured,
} from "@/lib/env.server";
import { resolveOpenAiVoice, type OpenAiTtsVoiceId } from "./openai-voices";
import { sanitizeTextForSpeech } from "./sanitize-for-speech";

export class TtsServiceError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number = 500
  ) {
    super(message);
    this.name = "TtsServiceError";
  }
}

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new TtsServiceError(
      "OPENAI_API_KEY fehlt in .env.local.",
      "OPENAI_NOT_CONFIGURED",
      503
    );
  }

  const apiKey = getOpenAIApiKey();
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export interface GenerateOpenAiSpeechOptions {
  text: string;
  lang?: string;
  voice?: OpenAiTtsVoiceId;
  speed?: number;
}

/**
 * Erzeugt MP3-Audio über OpenAI Text-to-Speech.
 * Modelle: tts-1 (schnell) | tts-1-hd (höchste Qualität)
 */
export async function generateOpenAiSpeech(
  options: GenerateOpenAiSpeechOptions
): Promise<Buffer> {
  const input = sanitizeTextForSpeech(options.text);
  if (!input) {
    throw new TtsServiceError("Kein Text zum Vorlesen.", "EMPTY_TEXT", 400);
  }

  const voice =
    options.voice ??
    resolveOpenAiVoice(null, options.lang ?? "de-DE");

  const speed = clampSpeed(options.speed ?? 1.15);

  try {
    const response = await getClient().audio.speech.create({
      model: getOpenAITtsModel(),
      voice,
      input,
      speed,
      response_format: "mp3",
    });

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    if (error instanceof TtsServiceError) throw error;

    if (error instanceof APIError) {
      console.error("[tts] OpenAI API error:", error.status, error.message);

      if (error.status === 401) {
        throw new TtsServiceError(
          "OpenAI API-Schlüssel ungültig.",
          "OPENAI_AUTH_ERROR",
          503
        );
      }

      if (error.status === 429) {
        throw new TtsServiceError(
          "TTS ist vorübergehend ausgelastet.",
          "OPENAI_RATE_LIMIT",
          429
        );
      }

      throw new TtsServiceError(
        `OpenAI TTS fehlgeschlagen (${error.status ?? "unknown"}).`,
        "OPENAI_ERROR",
        502
      );
    }

    console.error("[tts] Unexpected OpenAI TTS error:", error);
    throw new TtsServiceError(
      "Unerwarteter Fehler bei der Sprachsynthese.",
      "OPENAI_ERROR",
      502
    );
  }
}

function clampSpeed(speed: number): number {
  return Math.min(4, Math.max(0.25, speed));
}
