/**
 * Voice Mode – lokale Einstellungen (localStorage)
 */

import { DEFAULT_LANGUAGE } from "./languages";
import type { VoiceMode, VoicePreferences } from "./types";

const STORAGE_KEY = "avyzor-assistant-voice-prefs";

const DEFAULT_PREFS: VoicePreferences = {
  mode: "text-only",
  language: DEFAULT_LANGUAGE,
};

export function loadVoicePreferences(): VoicePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;

    const parsed = JSON.parse(raw) as Partial<VoicePreferences>;
    return {
      mode: parsed.mode ?? DEFAULT_PREFS.mode,
      language: parsed.language ?? DEFAULT_PREFS.language,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveVoicePreferences(prefs: VoicePreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Quota / private mode – stiller Fallback
  }
}

export function isVoiceModeActive(mode: VoiceMode): boolean {
  return mode === "text-and-voice" || mode === "voice-only";
}

export function shouldAutoSpeakResponses(mode: VoiceMode): boolean {
  return mode === "text-and-voice" || mode === "voice-only";
}
