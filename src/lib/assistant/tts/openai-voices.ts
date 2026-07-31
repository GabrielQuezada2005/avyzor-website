/**
 * OpenAI Text-to-Speech – Stimmen & Sprach-Mapping
 */

export const OPENAI_TTS_VOICES = [
  { id: "nova", label: "Nova" },
  { id: "shimmer", label: "Shimmer" },
  { id: "alloy", label: "Alloy" },
  { id: "echo", label: "Echo" },
  { id: "fable", label: "Fable" },
  { id: "onyx", label: "Onyx" },
] as const;

export type OpenAiTtsVoiceId = (typeof OPENAI_TTS_VOICES)[number]["id"];

export const OPENAI_VOICE_PREFIX = "openai:";

/** Premium-Standard pro Sprache (BCP-47 Präfix). */
export const DEFAULT_OPENAI_VOICE_BY_LANG: Record<string, OpenAiTtsVoiceId> = {
  de: "nova",
  en: "alloy",
  es: "shimmer",
  fr: "shimmer",
  it: "nova",
};

export function isOpenAiVoiceUri(voiceUri: string | null): boolean {
  return voiceUri?.startsWith(OPENAI_VOICE_PREFIX) ?? false;
}

export function toOpenAiVoiceUri(voiceId: string): string {
  return `${OPENAI_VOICE_PREFIX}${voiceId}`;
}

export function fromOpenAiVoiceUri(voiceUri: string | null): OpenAiTtsVoiceId | null {
  if (!voiceUri?.startsWith(OPENAI_VOICE_PREFIX)) return null;
  const id = voiceUri.slice(OPENAI_VOICE_PREFIX.length);
  return OPENAI_TTS_VOICES.some((v) => v.id === id)
    ? (id as OpenAiTtsVoiceId)
    : null;
}

export function resolveOpenAiVoice(
  voiceUri: string | null,
  lang: string
): OpenAiTtsVoiceId {
  const fromPref = voiceUri ? fromOpenAiVoiceUri(voiceUri) : null;
  if (fromPref) return fromPref;

  const prefix = lang.split("-")[0].toLowerCase();
  return DEFAULT_OPENAI_VOICE_BY_LANG[prefix] ?? "nova";
}
