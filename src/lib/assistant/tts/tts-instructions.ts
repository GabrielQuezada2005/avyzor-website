/**
 * Sprachspezifische Anweisungen für natürliche OpenAI TTS-Wiedergabe.
 * Nur für gpt-4o-mini-tts (instructions-Parameter).
 */

const INSTRUCTIONS_BY_LANG: Record<string, string> = {
  de: "Sprich natürlich und flüssig auf Deutsch mit menschlicher Betonung, angemessenen Pausen und warmem, professionellem Ton.",
  en: "Speak naturally and fluently in English with human-like intonation, appropriate pauses, and a warm professional tone.",
  es: "Habla de forma natural y fluida en español con entonación humana, pausas adecuadas y un tono cálido y profesional.",
  fr: "Parle naturellement et fluidement en français avec une intonation humaine, des pauses appropriées et un ton chaleureux et professionnel.",
  it: "Parla in modo naturale e fluente in italiano con intonazione umana, pause appropriate e un tono caldo e professionale.",
};

const DEFAULT_INSTRUCTIONS =
  "Speak naturally and fluently with human-like intonation, appropriate pauses, and a warm professional tone.";

export function getTtsInstructionsForLang(lang: string): string {
  const prefix = lang.split("-")[0].toLowerCase();
  return INSTRUCTIONS_BY_LANG[prefix] ?? DEFAULT_INSTRUCTIONS;
}
