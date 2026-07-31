/**
 * Text-to-Speech – Stimmenauswahl & Qualitätsbewertung
 *
 * Bevorzugt natürliche Systemstimmen – auf macOS besonders Apple Enhanced/Premium.
 */

/** Browser SpeechSynthesisVoice – nur im Client verfügbar. */
export type BrowserVoice = SpeechSynthesisVoice;

/** Niedrigwertige / novelty-Stimmen ausschließen. */
const LOW_QUALITY_PATTERNS = [
  /compact/i,
  /novelty/i,
  /cellos/i,
  /bad news/i,
  /bah/i,
  /bells/i,
  /boing/i,
  /bubbles/i,
  /deranged/i,
  /good news/i,
  /jester/i,
  /organ/i,
  /superstar/i,
  /trinoids/i,
  /whisper/i,
  /zarvox/i,
  /espeak/i,
  /festival/i,
  /sapi 4/i,
];

/** Hochwertige Apple/macOS-Stimmen-Muster. */
const PREMIUM_PATTERNS = [
  /enhanced/i,
  /premium/i,
  /\banna\b/i,
  /\bmarkus\b/i,
  /\bpetra\b/i,
  /\bhelena\b/i,
  /\bmarie\b/i,
  /\bthomas\b/i,
  /\bsamantha\b/i,
  /\balex\b/i,
  /\bserena\b/i,
  /\bkaren\b/i,
  /\bmelina\b/i,
  /\bluciana\b/i,
  /\bmonica\b/i,
  /\bpaola\b/i,
];

/** Natürliche System-Stimmen (Microsoft, Google Neural o. ä.). */
const NATURAL_PATTERNS = [
  /neural/i,
  /natural/i,
  /online/i,
  /google.*deutsch/i,
  /microsoft.*online/i,
];

function isMacOs(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

/**
 * Bewertet eine Stimme – höher = natürlicher / hochwertiger.
 */
export function scoreVoice(voice: BrowserVoice, langPrefix: string): number {
  let score = 0;
  const name = voice.name;
  const nameLower = name.toLowerCase();
  const voiceLang = voice.lang.toLowerCase();

  if (voiceLang.startsWith(langPrefix)) {
    score += 100;
  } else if (voiceLang.includes(langPrefix)) {
    score += 40;
  }

  if (LOW_QUALITY_PATTERNS.some((pattern) => pattern.test(name))) {
    score -= 200;
  }

  if (PREMIUM_PATTERNS.some((pattern) => pattern.test(name))) {
    score += 80;
  }

  if (NATURAL_PATTERNS.some((pattern) => pattern.test(name))) {
    score += 45;
  }

  if (isMacOs() && voice.localService) {
    score += 35;
    if (!nameLower.includes("compact")) {
      score += 25;
    }
  } else if (voice.localService) {
    score += 20;
  }

  if (nameLower.includes("google")) score += 15;
  if (nameLower.includes("microsoft")) score += 18;

  if (voice.default) score += 8;

  return score;
}

/**
 * Sortiert Stimmen nach Qualität (beste zuerst).
 */
export function rankVoicesForLanguage(
  voices: BrowserVoice[],
  lang: string
): BrowserVoice[] {
  if (voices.length === 0) return [];

  const prefix = lang.split("-")[0].toLowerCase();

  const byLang = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(prefix)
  );

  const pool = byLang.length > 0 ? byLang : voices;

  return [...pool].sort(
    (a, b) => scoreVoice(b, prefix) - scoreVoice(a, prefix)
  );
}

/**
 * Wählt die bestpassende Stimme für die Zielsprache.
 * Bevorzugt natürliche OS-Stimmen (Apple Enhanced auf macOS).
 */
export function selectBestVoice(
  voices: BrowserVoice[],
  lang: string
): BrowserVoice | null {
  const ranked = rankVoicesForLanguage(voices, lang);
  return ranked[0] ?? null;
}

/**
 * Findet Stimme anhand voiceURI – mit Fallback auf best match.
 */
export function resolveVoice(
  voices: BrowserVoice[],
  lang: string,
  voiceUri: string | null
): BrowserVoice | null {
  if (voiceUri) {
    const exact = voices.find((v) => v.voiceURI === voiceUri);
    if (exact) return exact;
  }

  return selectBestVoice(voices, lang);
}
