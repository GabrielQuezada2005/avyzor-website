/**
 * Sprachausgabe – Frage-Prosodie
 *
 * Weder ElevenLabs multilingual_v2 noch OpenAI gpt-4o-mini-tts unterstützen SSML.
 * Fragesätze werden deshalb über Text-Cues (und bei OpenAI zusätzlich Instructions)
 * natürlicher intoniert. Aussagesätze bleiben unverändert.
 *
 * Eleven v3: Audio-Tags wie [questioning] (nur mit Modell eleven_v3).
 */

export type SpeechProsodyTarget = "elevenlabs" | "openai" | "browser";

export interface QuestionProsodyOptions {
  target: SpeechProsodyTarget;
  /** Eleven v3 unterstützt Audio-Tags wie [questioning] für situative Intonation. */
  elevenLabsSupportsAudioTags?: boolean;
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+/;

function splitSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed.split(SENTENCE_SPLIT).filter(Boolean);
}

/** Prüft, ob ein Satz mit Fragezeichen endet. */
export function isQuestionSentence(sentence: string): boolean {
  return /\?\s*$/.test(sentence.trim());
}

/** True, wenn alle erkannten Sätze Fragesätze sind. */
export function textIsOnlyQuestions(text: string): boolean {
  const sentences = splitSentences(text);
  return sentences.length > 0 && sentences.every(isQuestionSentence);
}

function emphasizeQuestionEnding(
  sentence: string,
  options: QuestionProsodyOptions
): string {
  let result = sentence.trimEnd();

  // Komma direkt vor ? erzeugt oft flache Satzmelodie statt Anstieg
  result = result.replace(/,\s*\?$/, "?");
  // Leerzeichen vor ? trennt Satzmelodie vom Fragezeichen
  result = result.replace(/\s+\?$/, "?");

  if (options.target === "elevenlabs") {
    if (options.elevenLabsSupportsAudioTags) {
      // Eleven v3: Audio-Tag für steigende Frage-Intonation
      return `[questioning] ${result}`;
    }

    // multilingual_v2: kein SSML/Audio-Tags – Fragezeichen direkt anbinden.
    // Keine Ellipsis vor ? (erzeugt fallende Pause statt steigender Melodie).
    return result;
  }

  if (options.target === "browser") {
    return result;
  }

  // OpenAI: Fragezeichen + Instructions steuern Intonation
  return result;
}

/**
 * Bereitet Fragesätze für natürliche steigende Intonation vor.
 * Nicht-Frage-Sätze werden wortgleich zurückgegeben.
 */
export function applyQuestionProsody(
  text: string,
  targetOrOptions: SpeechProsodyTarget | QuestionProsodyOptions = "openai"
): string {
  if (!text.includes("?")) return text;

  const options: QuestionProsodyOptions =
    typeof targetOrOptions === "string"
      ? { target: targetOrOptions }
      : targetOrOptions;

  const sentences = splitSentences(text);
  if (sentences.length <= 1) {
    return isQuestionSentence(text)
      ? emphasizeQuestionEnding(text, options)
      : text;
  }

  return sentences
    .map((sentence, index) => {
      const enhanced = isQuestionSentence(sentence)
        ? emphasizeQuestionEnding(sentence, options)
        : sentence;
      return index === 0 ? enhanced : ` ${enhanced}`;
    })
    .join("");
}
