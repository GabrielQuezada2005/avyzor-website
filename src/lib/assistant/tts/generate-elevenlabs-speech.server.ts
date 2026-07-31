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
import { sanitizeTextForSpeech } from "./sanitize-for-speech";
import { TtsServiceError } from "./tts-service-error";

export { TtsServiceError };

export interface GenerateElevenLabsSpeechOptions {
  text: string;
  lang?: string;
  voice?: ElevenLabsVoiceId;
  speed?: number;
}

const ELEVENLABS_API = "https://api.elevenlabs.io/v1";

/** Natürliches Sprechtempo für Premium-Beratertone. */
const DEFAULT_ELEVENLABS_SPEED = 0.96;

function normalizeElevenLabsSpeed(speed?: number): number {
  if (speed === undefined) return DEFAULT_ELEVENLABS_SPEED;
  if (speed >= 1.12) return 0.96;
  if (speed >= 1.05) return 0.98;
  return clampElevenLabsSpeed(speed);
}

function buildRequestBody(
  text: string,
  speed: number
): Record<string, unknown> {
  return {
    text,
    model_id: getElevenLabsModelId(),
    voice_settings: {
      stability: 0.42,
      similarity_boost: 0.85,
      style: 0.28,
      use_speaker_boost: true,
    },
    speed: normalizeElevenLabsSpeed(speed),
  };
}

function clampElevenLabsSpeed(speed: number): number {
  return Math.min(1.1, Math.max(0.85, speed));
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

  const text = sanitizeTextForSpeech(options.text);
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
  const speed = options.speed ?? DEFAULT_ELEVENLABS_SPEED;

  const response = await fetch(
    `${ELEVENLABS_API}/text-to-speech/${voiceId}`,
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
    handleElevenLabsError(response.status, errorBody);
  }

  return Buffer.from(await response.arrayBuffer());
}

/** Streamt MP3-Audio für niedrigere Latenz. */
export async function generateElevenLabsSpeechStream(
  options: GenerateElevenLabsSpeechOptions
): Promise<ReadableStream<Uint8Array>> {
  const { voiceId, text } = resolveVoiceAndText(options);
  const speed = options.speed ?? DEFAULT_ELEVENLABS_SPEED;

  const response = await fetch(
    `${ELEVENLABS_API}/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`,
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
    handleElevenLabsError(response.status, errorBody);
  }

  if (!response.body) {
    throw new TtsServiceError(
      "ElevenLabs lieferte keinen Audio-Stream.",
      "ELEVENLABS_NO_STREAM",
      502
    );
  }

  return response.body;
}
