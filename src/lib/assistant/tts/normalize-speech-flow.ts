/**
 * Textglättung für natürlichen Sprachfluss (OpenAI + ElevenLabs).
 *
 * Wird vor der Synthese angewendet (gleiche API, optimierter Textstring).
 * Komma/Gedankenstrich/Doppelpunkt: sehr kurze Pause (Bindestrich ohne Leerzeichen).
 * Punkt: etwas längere Pause (Punkt + Leerzeichen bleibt erhalten).
 */

const DECIMAL_COMMA = "\uE000";
const DECIMAL_COLON = "\uE001";

/** Nebenordnende Konjunktionen – Komma davor erzeugt bei TTS-Modellen lange Pause. */
const SUBORDINATE =
  "dass|weil|wenn|ob|als|damit|indem|obwohl|während|falls|sofern";

export function normalizeSpeechFlow(text: string): string {
  const protectedText = text
    .replace(/(\d),(\d)/g, `$1${DECIMAL_COMMA}$2`)
    .replace(/(\d):(\d)/g, `$1${DECIMAL_COLON}$2`);

  const normalized = protectedText
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/(?:^|\s)[-•*]\s+/g, " ")
    .replace(/\s*[–—―−]\s*/g, "-")
    .replace(/\s+-\s+/g, "-")
    .replace(/([a-zA-ZäöüÄÖÜß]):(?=\s)/g, "$1,")
    .replace(/:(?!\s*\d)\s*/g, ",")
    .replace(/;\s*/g, "-")
    .replace(/\(\s*/g, ",")
    .replace(/\s*\)/g, "")
    .replace(/\.{3,}/g, ".")
    .replace(/\s*…\s*/g, ". ")
    .replace(/([,!.?])\1+/g, "$1")
    .replace(/\s+([,!.?])/g, "$1")
    // Komma vor Nebensatz-Konjunktion → Leerzeichen (fließender als ", dass")
    .replace(new RegExp(`,\\s*(?=${SUBORDINATE})\\b`, "gi"), " ")
    // Komma/Semikolon → Bindestrich ohne Leerzeichen (kürzere Pause als Komma)
    .replace(/,\s+/g, "-")
    .replace(/\.(?=[A-Za-zÄÖÜäöüß])/g, ". ")
    .replace(/\.(?!\s|$)/g, ". ")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return normalized
    .replace(new RegExp(DECIMAL_COMMA, "g"), ",")
    .replace(new RegExp(DECIMAL_COLON, "g"), ":");
}

/** @deprecated Alias – nutze normalizeSpeechFlow */
export function normalizeElevenLabsSpeechFlow(text: string): string {
  return normalizeSpeechFlow(text);
}
