import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/api/security";
import {
  generateTtsAudio,
  TtsServiceError,
} from "@/lib/assistant/tts/generate-tts.server";
import {
  DEFAULT_ELEVENLABS_VOICE_BY_LANG,
  ELEVENLABS_TTS_VOICES,
} from "@/lib/assistant/tts/elevenlabs-voices";
import {
  DEFAULT_OPENAI_VOICE_BY_LANG,
  OPENAI_TTS_VOICES,
} from "@/lib/assistant/tts/openai-voices";
import { ttsRequestSchema } from "@/lib/assistant/tts/validation";
import {
  getElevenLabsModelId,
  getElevenLabsVoiceId,
  getOpenAITtsModel,
  getOpenAITtsVoice,
  isCloudTtsConfigured,
  isElevenLabsTtsConfigured,
  isOpenAITtsConfigured,
  resolveActiveTtsProvider,
} from "@/lib/env.server";

export const runtime = "nodejs";

/** Status & verfügbare Premium-Stimmen (kein API-Key im Response). */
export async function GET() {
  const activeProvider = resolveActiveTtsProvider();
  const available = isCloudTtsConfigured();

  const openaiAvailable = isOpenAITtsConfigured();
  const elevenLabsAvailable = isElevenLabsTtsConfigured();

  const active =
    activeProvider === "elevenlabs"
      ? {
          model: getElevenLabsModelId(),
          defaultVoice: getElevenLabsVoiceId(),
          voices: ELEVENLABS_TTS_VOICES,
          defaultVoiceByLang: DEFAULT_ELEVENLABS_VOICE_BY_LANG,
        }
      : {
          model: getOpenAITtsModel(),
          defaultVoice: getOpenAITtsVoice(),
          voices: OPENAI_TTS_VOICES,
          defaultVoiceByLang: DEFAULT_OPENAI_VOICE_BY_LANG,
        };

  return NextResponse.json({
    available,
    activeProvider: activeProvider ?? "browser",
    provider: activeProvider ?? "browser",
    model: available ? active.model : null,
    defaultVoice: available ? active.defaultVoice : null,
    voices: available ? active.voices : [],
    defaultVoiceByLang: available ? active.defaultVoiceByLang : {},
    streaming: available,
    providers: {
      openai: {
        available: openaiAvailable,
        model: openaiAvailable ? getOpenAITtsModel() : null,
        voices: OPENAI_TTS_VOICES,
      },
      elevenlabs: {
        available: elevenLabsAvailable,
        model: elevenLabsAvailable ? getElevenLabsModelId() : null,
        voices: ELEVENLABS_TTS_VOICES,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  const activeProvider = resolveActiveTtsProvider();
  if (!activeProvider) {
    return NextResponse.json(
      {
        success: false,
        error: "Kein TTS-Anbieter konfiguriert.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = ttsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message ?? "Ungültige Anfrage.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { text, lang, provider, voiceUri, voice, speed, stream } =
      parsed.data;

    const resolvedVoiceUri =
      voiceUri ??
      (voice
        ? voice.includes(":")
          ? voice
          : `${provider ?? activeProvider}:${voice}`
        : null);

    const resolvedProvider = provider ?? activeProvider;

    const audio = await generateTtsAudio({
      provider: resolvedProvider,
      text,
      lang,
      voiceUri: resolvedVoiceUri,
      speed,
      stream: stream ?? true,
    });

    if (audio instanceof ReadableStream) {
      return new NextResponse(audio, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-cache",
          "Transfer-Encoding": "chunked",
          "X-TTS-Provider": resolvedProvider,
        },
      });
    }

    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
        "X-TTS-Provider": resolvedProvider,
      },
    });
  } catch (error) {
    if (error instanceof TtsServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("[tts] Unhandled API error:", error);
    return NextResponse.json(
      { success: false, error: "TTS-Fehler.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
