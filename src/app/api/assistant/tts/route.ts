import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/api/security";
import {
  generateOpenAiSpeech,
  TtsServiceError,
} from "@/lib/assistant/tts/generate-openai-speech.server";
import {
  DEFAULT_OPENAI_VOICE_BY_LANG,
  OPENAI_TTS_VOICES,
  resolveOpenAiVoice,
} from "@/lib/assistant/tts/openai-voices";
import {
  getOpenAITtsModel,
  getOpenAITtsVoice,
  isOpenAITtsConfigured,
} from "@/lib/env.server";
import { ttsRequestSchema } from "@/lib/assistant/tts/validation";

export const runtime = "nodejs";

/** Status & verfügbare Premium-Stimmen (kein API-Key im Response). */
export async function GET() {
  const available = isOpenAITtsConfigured();

  return NextResponse.json({
    available,
    provider: available ? "openai" : "browser",
    model: available ? getOpenAITtsModel() : null,
    defaultVoice: getOpenAITtsVoice(),
    voices: OPENAI_TTS_VOICES,
    defaultVoiceByLang: DEFAULT_OPENAI_VOICE_BY_LANG,
  });
}

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  if (!isOpenAITtsConfigured()) {
    return NextResponse.json(
      { success: false, error: "OpenAI TTS nicht konfiguriert.", code: "NOT_CONFIGURED" },
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

    const { text, lang, voice, speed } = parsed.data;
    const resolvedVoice = voice ?? resolveOpenAiVoice(null, lang ?? "de-DE");

    const audio = await generateOpenAiSpeech({
      text,
      lang,
      voice: resolvedVoice,
      speed,
    });

    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
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
