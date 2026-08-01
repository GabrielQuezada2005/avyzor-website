import "server-only";

import {
  getElevenLabsApiKey,
  getElevenLabsModelId,
  isElevenLabsTtsConfigured,
} from "@/lib/env.server";
import {
  resolveElevenLabsVoice,
  type ElevenLabsVoiceId,
} from "./elevenlabs-voices";
import { applyQuestionProsody } from "./apply-question-prosody";
import { sanitizeTextForSpeech } from "./sanitize-for-speech";
import { normalizeSpeechFlow } from "./normalize-speech-flow";
import {
  headersToRecord,
  logTtsDebugReport,
} from "./tts-debug-log";
import { TtsServiceError } from "./tts-service-error";

export { TtsServiceError };

export interface GenerateElevenLabsSpeechOptions {
  text: string;
  lang?: string;
  voice?: ElevenLabsVoiceId;
  speed?: number;
}

const ELEVENLABS_API = "https://api.elevenlabs.io/v1";

/** Flüssiges Sprechtempo (~1.11× bei UI-Standard 1.0, ca. 11 % schneller). */
const FLUENT_ELEVENLABS_SPEED = 1.11;
const UI_RATE_BASELINE = 1.0;

function normalizeElevenLabsSpeed(speed?: number): number {
  const uiRate = speed ?? UI_RATE_BASELINE;
  return clampElevenLabsSpeed(
    FLUENT_ELEVENLABS_SPEED * (uiRate / UI_RATE_BASELINE)
  );
}

function buildRequestBody(
  text: string,
  speed: number
): Record<string, unknown> {
  return {
    text,
    model_id: getElevenLabsModelId(),
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.85,
      style: 0.18,
      use_speaker_boost: true,
    },
    speed: normalizeElevenLabsSpeed(speed),
  };
}

function clampElevenLabsSpeed(speed: number): number {
  return Math.min(1.12, Math.max(0.85, speed));
}

function resolveVoiceAndText(
  options: GenerateElevenLabsSpeechOptions
): { voiceId: ElevenLabsVoiceId; text: string } {
  if (!isElevenLabsTtsConfigured()) {
    throw new TtsServiceError(
      "ELEVENLABS_API_KEY fehlt in .env.local.",
      "ELEVENLABS_NOT_CONFIGURED",
      503
    );
  }

  const sanitized = sanitizeTextForSpeech(options.text);
  const normalized = normalizeSpeechFlow(sanitized);
  const modelId = getElevenLabsModelId();
  const text = applyQuestionProsody(normalized, {
    target: "elevenlabs",
    elevenLabsSupportsAudioTags: modelId.includes("v3"),
  });
  if (!text) {
    throw new TtsServiceError("Kein Text zum Vorlesen.", "EMPTY_TEXT", 400);
  }

  const voiceId =
    options.voice ??
    resolveElevenLabsVoice(null, options.lang ?? "de-DE");

  return { voiceId, text };
}

function handleElevenLabsError(status: number, body: string): never {
  console.error("[tts] ElevenLabs API error:", status, body);

  if (status === 401) {
    throw new TtsServiceError(
      "ElevenLabs API-Schlüssel ungültig.",
      "ELEVENLABS_AUTH_ERROR",
      503
    );
  }

  if (status === 429) {
    throw new TtsServiceError(
      "TTS ist vorübergehend ausgelastet.",
      "ELEVENLABS_RATE_LIMIT",
      429
    );
  }

  throw new TtsServiceError(
    `ElevenLabs TTS fehlgeschlagen (${status}).`,
    "ELEVENLABS_ERROR",
    502
  );
}

/** Erzeugt MP3-Audio über ElevenLabs Text-to-Speech. */
export async function generateElevenLabsSpeech(
  options: GenerateElevenLabsSpeechOptions
): Promise<Buffer> {
  const { voiceId, text } = resolveVoiceAndText(options);
  const speed = options.speed ?? UI_RATE_BASELINE;
  const requestUrl = `${ELEVENLABS_API}/text-to-speech/${voiceId}`;
  const modelId = getElevenLabsModelId();

  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        "xi-api-key": getElevenLabsApiKey(),
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(buildRequestBody(text, speed)),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    logTtsDebugReport({
      ttsProvider: "elevenlabs",
      voiceId,
      model: modelId,
      responseStatus: response.status,
      audioSource: "none (ElevenLabs API error)",
      requestUrl,
      responseHeaders: headersToRecord(response.headers),
      phase: "server-upstream",
    });
    handleElevenLabsError(response.status, errorBody);
  }

  logTtsDebugReport({
    ttsProvider: "elevenlabs",
    voiceId,
    model: modelId,
    responseStatus: response.status,
    audioSource: "ElevenLabs API",
    requestUrl,
    responseHeaders: headersToRecord(response.headers),
    phase: "server-upstream",
  });

  return Buffer.from(await response.arrayBuffer());
}

/** Streamt MP3-Audio für niedrigere Latenz. */
export async function generateElevenLabsSpeechStream(
  options: GenerateElevenLabsSpeechOptions
): Promise<ReadableStream<Uint8Array>> {
  const { voiceId, text } = resolveVoiceAndText(options);
  const speed = options.speed ?? UI_RATE_BASELINE;
  const requestUrl = `${ELEVENLABS_API}/text-to-speech/${voiceId}/stream?optimize_streaming_latency=4`;
  const modelId = getElevenLabsModelId();

  const response = await fetch(
    requestUrl,
    {
      method: "POST",
      headers: {
        "xi-api-key": getElevenLabsApiKey(),
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(buildRequestBody(text, speed)),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    logTtsDebugReport({
      ttsProvider: "elevenlabs",
      voiceId,
      model: modelId,
      responseStatus: response.status,
      audioSource: "none (ElevenLabs API error)",
      requestUrl,
      responseHeaders: headersToRecord(response.headers),
      phase: "server-upstream",
    });
    handleElevenLabsError(response.status, errorBody);
  }

  logTtsDebugReport({
    ttsProvider: "elevenlabs",
    voiceId,
    model: modelId,
    responseStatus: response.status,
    audioSource: "ElevenLabs API (stream)",
    requestUrl,
    responseHeaders: headersToRecord(response.headers),
    phase: "server-upstream",
  });

  if (!response.body) {
    throw new TtsServiceError(
      "ElevenLabs lieferte keinen Audio-Stream.",
      "ELEVENLABS_NO_STREAM",
      502
    );
  }

  return response.body;
}
