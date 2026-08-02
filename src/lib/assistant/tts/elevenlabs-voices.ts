/**
 * ElevenLabs Text-to-Speech – Stimmen & Sprach-Mapping
 *
 * Daniel (multilingual v2): männlich, warm, ruhig, selbstbewusst – Premium-Berater
 * für Deutsch. Autoritativ ohne Nachrichtensprecher- oder Callcenter-Ton.
 */

export const ELEVENLABS_TTS_VOICES = [
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah" },
  { id: "pNInz6obpgDQGcFmaJgB", label: "Adam" },
  { id: "21m00Tcm4TlvDq8ikWAM", label: "Rachel" },
  { id: "XB0fDUnXU5powFXDhCwa", label: "Charlotte" },
] as const;

export type ElevenLabsVoiceId = (typeof ELEVENLABS_TTS_VOICES)[number]["id"];

/** Premium-Standard (Daniel) – synchron zu ELEVENLABS_VOICE_ID / getElevenLabsVoiceId(). */
export const DEFAULT_ELEVENLABS_VOICE_ID: ElevenLabsVoiceId =
  "onwK4e9ZLuTAKqWW03F9";

export const ELEVENLABS_VOICE_PREFIX = "elevenlabs:";

/** Premium-Standard pro Sprache (BCP-47 Präfix). */
export const DEFAULT_ELEVENLABS_VOICE_BY_LANG: Record<string, ElevenLabsVoiceId> =
  {
    de: "onwK4e9ZLuTAKqWW03F9",
    en: "EXAVITQu4vr4xnSDxMaL",
    es: "XB0fDUnXU5powFXDhCwa",
    fr: "XB0fDUnXU5powFXDhCwa",
    it: "EXAVITQu4vr4xnSDxMaL",
  };

export function isElevenLabsVoiceUri(voiceUri: string | null): boolean {
  return voiceUri?.startsWith(ELEVENLABS_VOICE_PREFIX) ?? false;
}

export function toElevenLabsVoiceUri(voiceId: string): string {
  return `${ELEVENLABS_VOICE_PREFIX}${voiceId}`;
}

export function fromElevenLabsVoiceUri(
  voiceUri: string | null
): ElevenLabsVoiceId | null {
  if (!voiceUri?.startsWith(ELEVENLABS_VOICE_PREFIX)) return null;
  const id = voiceUri.slice(ELEVENLABS_VOICE_PREFIX.length);
  return ELEVENLABS_TTS_VOICES.some((v) => v.id === id)
    ? (id as ElevenLabsVoiceId)
    : null;
}

export function resolveElevenLabsVoice(
  voiceUri: string | null,
  _lang: string,
  configuredDefault: ElevenLabsVoiceId = DEFAULT_ELEVENLABS_VOICE_ID
): ElevenLabsVoiceId {
  const fromPref = voiceUri ? fromElevenLabsVoiceUri(voiceUri) : null;
  if (fromPref) return fromPref;

  return configuredDefault;
}
