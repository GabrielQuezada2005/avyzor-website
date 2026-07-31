import "server-only";

const PLACEHOLDER_PATTERNS = [
  "your_api_key",
  "your-openai-api-key",
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

/** OpenAI TTS Modell – tts-1 (schnell) oder tts-1-hd (Premium-Qualität). */
export function getOpenAITtsModel(): string {
  return readEnv("OPENAI_TTS_MODEL") || "tts-1-hd";
}

/** Standard-Stimme für OpenAI TTS (nova = natürlich, gut für Deutsch). */
export function getOpenAITtsVoice(): string {
  return readEnv("OPENAI_TTS_VOICE") || "nova";
}

export function isOpenAITtsConfigured(): boolean {
  return isOpenAIConfigured();
}
