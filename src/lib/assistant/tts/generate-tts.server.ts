import "server-only";

import {
  generateElevenLabsSpeech,
  generateElevenLabsSpeechStream,
} from "./generate-elevenlabs-speech.server";
import {
  generateOpenAiSpeech,
  generateOpenAiSpeechStream,
} from "./generate-openai-speech.server";
import { resolveOpenAiVoice } from "./openai-voices";
import { resolveElevenLabsVoice, type ElevenLabsVoiceId } from "./elevenlabs-voices";
import { TtsServiceError } from "./tts-service-error";
import {
  getElevenLabsVoiceId,
  type TtsCloudProvider,
} from "@/lib/env.server";

export interface TtsGenerationRequest {
  provider: TtsCloudProvider;
  text: string;
  lang?: string;
  /** Stimmen-URI (openai:nova, elevenlabs:ID) oder Roh-ID. */
  voiceUri?: string | null;
  speed?: number;
  stream?: boolean;
}

export async function generateTtsAudio(
  request: TtsGenerationRequest
): Promise<Buffer | ReadableStream<Uint8Array>> {
  const { provider, text, lang, voiceUri, speed, stream = true } = request;
  const resolvedLang = lang ?? "de-DE";

  if (provider === "elevenlabs") {
    const voice = resolveElevenLabsVoice(
      voiceUri ?? null,
      resolvedLang,
      getElevenLabsVoiceId() as ElevenLabsVoiceId
    );
    const options = { text, lang: resolvedLang, voice, speed };

    return stream
      ? generateElevenLabsSpeechStream(options)
      : generateElevenLabsSpeech(options);
  }

  const voice = resolveOpenAiVoice(voiceUri ?? null, resolvedLang);
  const options = { text, lang: resolvedLang, voice, speed };

  return stream
    ? generateOpenAiSpeechStream(options)
    : generateOpenAiSpeech(options);
}

export { TtsServiceError };
