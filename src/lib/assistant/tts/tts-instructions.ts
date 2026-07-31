/**
 * Sprachspezifische Anweisungen für natürliche OpenAI TTS-Wiedergabe.
 * Nur für gpt-4o-mini-tts (instructions-Parameter).
 */

const INSTRUCTIONS_BY_LANG: Record<string, string> = {
  de: "Sprich wie ein professioneller deutscher Unternehmensberater. Natürlich, ruhig, freundlich, selbstbewusst und flüssig. Vermeide roboterhafte Betonung und unnatürliche Pausen.",
  en: "Speak like a professional business consultant. Natural, calm, friendly, confident and fluent. Avoid robotic intonation and unnatural pauses.",
  es: "Habla como un consultor empresarial profesional. Natural, calmado, amable, seguro y fluido. Evita entonación robótica y pausas innaturales.",
  fr: "Parle comme un consultant d'entreprise professionnel. Naturel, calme, amical, confiant et fluide. Évite l'intonation robotique et les pauses non naturelles.",
  it: "Parla come un consulente aziendale professionista. Naturale, calmo, amichevole, sicuro e fluente. Evita intonazione robotica e pause innaturali.",
};

const DEFAULT_INSTRUCTIONS =
  "Speak like a professional business consultant. Natural, calm, friendly, confident and fluent. Avoid robotic intonation and unnatural pauses.";

export function getTtsInstructionsForLang(lang: string): string {
  const prefix = lang.split("-")[0].toLowerCase();
  return INSTRUCTIONS_BY_LANG[prefix] ?? DEFAULT_INSTRUCTIONS;
}
