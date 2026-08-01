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

// ── CRM Admin ───────────────────────────────────────────────────────────────

export function getCrmAdminSecret(): string {
  return readEnv("CRM_ADMIN_SECRET");
}

export function isCrmAdminConfigured(): boolean {
  return !isPlaceholder(getCrmAdminSecret());
}

// ── Kundenportal Auth ───────────────────────────────────────────────────────

export function getPortalAuthSecret(): string {
  return readEnv("PORTAL_AUTH_SECRET");
}

export function isPortalAuthConfigured(): boolean {
  return !isPlaceholder(getPortalAuthSecret());
}

// ── Stripe ──────────────────────────────────────────────────────────────────

export function getStripeSecretKey(): string {
  return readEnv("STRIPE_SECRET_KEY");
}

export function isStripeConfigured(): boolean {
  const key = getStripeSecretKey();
  return Boolean(
    key &&
      !key.includes("your_key") &&
      !key.startsWith("sk_your") &&
      !isPlaceholder(key)
  );
}

export function getStripeWebhookSecret(): string {
  return readEnv("STRIPE_WEBHOOK_SECRET");
}

export function isStripeWebhookConfigured(): boolean {
  return !isPlaceholder(getStripeWebhookSecret());
}

// ── Production ──────────────────────────────────────────────────────────────

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

export interface ProductionEnvCheck {
  ok: boolean;
  missing: string[];
  warnings: string[];
}

/** Prüft kritische Env-Variablen für Production-Deployments. */
export function checkProductionEnvironment(): ProductionEnvCheck {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!isProductionRuntime()) {
    return { ok: true, missing, warnings };
  }

  const required = [
    "NEXT_PUBLIC_SITE_URL",
    "CRM_ADMIN_SECRET",
    "PORTAL_AUTH_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
  ];

  for (const name of required) {
    const value = readEnv(name);
    if (isPlaceholder(value)) {
      missing.push(name);
    }
  }

  if (!isOpenAIConfigured() && !isElevenLabsTtsConfigured()) {
    warnings.push("Kein TTS-Anbieter konfiguriert (Assistant ohne Sprache).");
  }

  if (!isStripeConfigured()) {
    warnings.push("Stripe nicht konfiguriert (Online-Zahlungen deaktiviert).");
  }

  if (!isTurnstileConfigured()) {
    warnings.push("Turnstile nicht konfiguriert (Spam-Schutz nur via Honeypot).");
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings,
  };
}

function isTurnstileConfigured(): boolean {
  const secret = readEnv("TURNSTILE_SECRET_KEY");
  const siteKey = readEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  return Boolean(secret && siteKey && !isPlaceholder(secret));
}
