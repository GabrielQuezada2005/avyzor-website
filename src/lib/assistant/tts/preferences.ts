/**
 * Text-to-Speech – Nutzer-Einstellungen (localStorage)
 *
 * Persistiert Stimme, Geschwindigkeit, Tonhöhe und Lautstärke.
 */

export interface TtsPreferences {
  /** null = automatisch beste Stimme wählen */
  voiceUri: string | null;
  /** Sprechgeschwindigkeit (0.5 – 2.0) */
  rate: number;
  /** Tonhöhe (0 – 2) */
  pitch: number;
  /** Lautstärke (0 – 1) */
  volume: number;
}

export const DEFAULT_TTS_RATE = 1.0;

export const DEFAULT_TTS_PREFERENCES: TtsPreferences = {
  voiceUri: null,
  rate: DEFAULT_TTS_RATE,
  pitch: 1,
  volume: 1,
};

const STORAGE_KEY = "avyzor-assistant-tts-prefs";

type TtsPreferencesListener = (prefs: TtsPreferences) => void;

const listeners = new Set<TtsPreferencesListener>();

let cachedPrefs: TtsPreferences | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizePreferences(
  partial: Partial<TtsPreferences>
): TtsPreferences {
  const base = cachedPrefs ?? DEFAULT_TTS_PREFERENCES;
  return {
    voiceUri:
      partial.voiceUri === undefined ? base.voiceUri : partial.voiceUri,
    rate: clamp(
      partial.rate ?? base.rate,
      0.5,
      2
    ),
    pitch: clamp(partial.pitch ?? base.pitch, 0, 2),
    volume: clamp(partial.volume ?? base.volume, 0, 1),
  };
}

export function loadTtsPreferences(): TtsPreferences {
  if (cachedPrefs) return cachedPrefs;

  if (typeof window === "undefined") {
    return DEFAULT_TTS_PREFERENCES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedPrefs = DEFAULT_TTS_PREFERENCES;
      return cachedPrefs;
    }

    const parsed = JSON.parse(raw) as Partial<TtsPreferences>;
    cachedPrefs = normalizePreferences(parsed);
    return cachedPrefs;
  } catch {
    cachedPrefs = DEFAULT_TTS_PREFERENCES;
    return cachedPrefs;
  }
}

export function saveTtsPreferences(prefs: TtsPreferences): void {
  cachedPrefs = normalizePreferences(prefs);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedPrefs));
    } catch {
      // Quota / private mode – stiller Fallback
    }
  }

  listeners.forEach((listener) => listener(cachedPrefs!));
}

export function updateTtsPreferences(
  partial: Partial<TtsPreferences>
): TtsPreferences {
  const next = normalizePreferences({
    ...loadTtsPreferences(),
    ...partial,
  });
  saveTtsPreferences(next);
  return next;
}

export function subscribeTtsPreferences(
  listener: TtsPreferencesListener
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetTtsPreferences(): TtsPreferences {
  saveTtsPreferences(DEFAULT_TTS_PREFERENCES);
  return DEFAULT_TTS_PREFERENCES;
}
