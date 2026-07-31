import "server-only";

const PLACEHOLDER_PATTERNS = [
  "your_api_key",
  "your-openai-api-key",
  "your-elevenlabs",
  "sk-your",
  "changeme",
  "replace_me",
];

function readEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}

function isPlaceholder(value: string): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function getOpenAIApiKey(): string {
  return readEnv("OPENAI_API_KEY");
}

export function getOpenAIModel(): string {
  return readEnv("OPENAI_MODEL") || "gpt-4o-mini";
}

export function getOpenAIMaxTokens(): number {
  const parsed = Number(readEnv("OPENAI_MAX_TOKENS") || "800");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 800;
}

export function isOpenAIConfigured(): boolean {
  return !isPlaceholder(getOpenAIApiKey());
}

/** OpenAI TTS Modell – gpt-4o-mini-tts (Standard), tts-1, tts-1-hd. */
export function getOpenAITtsModel(): string {
  return readEnv("OPENAI_TTS_MODEL") || "gpt-4o-mini-tts";
}

/** Standard-Stimme für OpenAI TTS (shimmer = klar, professionell, gut für Deutsch). */
export function getOpenAITtsVoice(): string {
  return readEnv("OPENAI_TTS_VOICE") || "shimmer";
}

export function isOpenAITtsConfigured(): boolean {
  return isOpenAIConfigured();
}

/** Bevorzugter Cloud-TTS-Anbieter: elevenlabs (Standard) | openai (Fallback) */
export type TtsCloudProvider = "openai" | "elevenlabs";

export function getTtsProvider(): TtsCloudProvider {
  const value = readEnv("TTS_PROVIDER").toLowerCase();
  return value === "openai" ? "openai" : "elevenlabs";
}

// ── ElevenLabs TTS ──────────────────────────────────────────────────────────

export function getElevenLabsApiKey(): string {
  return readEnv("ELEVENLABS_API_KEY");
}

export function getElevenLabsModelId(): string {
  return readEnv("ELEVENLABS_MODEL_ID") || "eleven_multilingual_v2";
}

export function getElevenLabsVoiceId(): string {
  return readEnv("ELEVENLABS_VOICE_ID") || "onwK4e9ZLuTAKqWW03F9";
}

export function isElevenLabsTtsConfigured(): boolean {
  return !isPlaceholder(getElevenLabsApiKey());
}

/** Aktiver Cloud-Anbieter – ElevenLabs bevorzugt, OpenAI als Fallback. */
export function resolveActiveTtsProvider(): TtsCloudProvider | null {
  const preferred = getTtsProvider();

  if (preferred === "elevenlabs") {
    if (isElevenLabsTtsConfigured()) return "elevenlabs";
    if (isOpenAITtsConfigured()) return "openai";
    return null;
  }

  if (isOpenAITtsConfigured()) return "openai";
  if (isElevenLabsTtsConfigured()) return "elevenlabs";
  return null;
}

/** Sekundärer Cloud-Fallback (ElevenLabs → OpenAI). */
export function resolveTtsFallbackProvider(
  primary: TtsCloudProvider
): TtsCloudProvider | null {
  if (primary === "elevenlabs" && isOpenAITtsConfigured()) return "openai";
  if (primary === "openai" && isElevenLabsTtsConfigured()) return "elevenlabs";
  return null;
}

export function isCloudTtsConfigured(): boolean {
  return resolveActiveTtsProvider() !== null;
}
