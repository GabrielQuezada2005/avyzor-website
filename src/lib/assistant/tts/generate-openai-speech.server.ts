import "server-only";

import OpenAI, { APIError } from "openai";
import {
  getOpenAIApiKey,
  getOpenAITtsModel,
  isOpenAIConfigured,
} from "@/lib/env.server";
import { resolveOpenAiVoice, type OpenAiTtsVoiceId } from "./openai-voices";
import { applyQuestionProsody } from "./apply-question-prosody";
import { normalizeSpeechFlow } from "./normalize-speech-flow";
import { sanitizeTextForSpeech } from "./sanitize-for-speech";
import { getTtsInstructionsForLang } from "./tts-instructions";
import { TtsServiceError } from "./tts-service-error";

export { TtsServiceError };

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

/** Flüssiges Sprechtempo (~1.10× bei UI-Standard 1.0, ca. 10 % schneller). */
const FLUENT_OPENAI_SPEED = 1.1;
const UI_RATE_BASELINE = 1.0;

function normalizeOpenAiSpeed(speed?: number): number {
  const uiRate = speed ?? UI_RATE_BASELINE;
  return clampSpeed(FLUENT_OPENAI_SPEED * (uiRate / UI_RATE_BASELINE));
}

function buildSpeechParams(options: GenerateOpenAiSpeechOptions) {
  const sanitized = sanitizeTextForSpeech(options.text);
  const normalized = normalizeSpeechFlow(sanitized);
  const input = applyQuestionProsody(normalized, "openai");
  if (!input) {
    throw new TtsServiceError("Kein Text zum Vorlesen.", "EMPTY_TEXT", 400);
  }

  const lang = options.lang ?? "de-DE";
  const voice =
    options.voice ?? resolveOpenAiVoice(null, lang);
  const speed = normalizeOpenAiSpeed(options.speed);
  const model = getOpenAITtsModel();

  const params: OpenAI.Audio.SpeechCreateParams = {
    model,
    voice,
    input,
    speed,
    response_format: "mp3",
  };

  if (model.includes("gpt-4o-mini-tts")) {
    params.instructions = getTtsInstructionsForLang(lang, input);
  }

  return params;
}

function handleOpenAiError(error: unknown): never {
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

/**
 * Erzeugt MP3-Audio über OpenAI Text-to-Speech.
 * Standardmodell: gpt-4o-mini-tts (natürlich, emotional)
 */
export async function generateOpenAiSpeech(
  options: GenerateOpenAiSpeechOptions
): Promise<Buffer> {
  try {
    const params = buildSpeechParams(options);
    const response = await getClient().audio.speech.create(params);
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    handleOpenAiError(error);
  }
}

/** Streamt MP3-Audio für niedrigere Latenz (Chunked Transfer). */
export async function generateOpenAiSpeechStream(
  options: GenerateOpenAiSpeechOptions
): Promise<ReadableStream<Uint8Array>> {
  try {
    const params = buildSpeechParams(options);
    const response = await getClient().audio.speech.create(params);

    if (!response.body) {
      throw new TtsServiceError(
        "OpenAI lieferte keinen Audio-Stream.",
        "OPENAI_NO_STREAM",
        502
      );
    }

    return response.body;
  } catch (error) {
    handleOpenAiError(error);
  }
}

function clampSpeed(speed: number): number {
  return Math.min(4, Math.max(0.25, speed));
}
