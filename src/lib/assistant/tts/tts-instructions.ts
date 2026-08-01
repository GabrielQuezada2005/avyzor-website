/**
 * Sprachspezifische Anweisungen für natürliche OpenAI TTS-Wiedergabe.
 * Nur für gpt-4o-mini-tts (instructions-Parameter).
 */

const INSTRUCTIONS_BY_LANG: Record<string, string> = {
  de: "Sprich wie ein professioneller deutscher Unternehmensberater. Natürlich, freundlich, selbstbewusst und flüssig. Vermeide roboterhafte Betonung.",
  en: "Speak like a professional business consultant. Natural, friendly, confident and fluent. Avoid robotic intonation.",
  es: "Habla como un consultor empresarial profesional. Natural, amable, seguro y fluido. Evita entonación robótica.",
  fr: "Parle comme un consultant d'entreprise professionnel. Naturel, amical, confiant et fluide. Évite l'intonation robotique.",
  it: "Parla come un consulente aziendale professionista. Naturale, amichevole, sicuro e fluente. Evita intonazione robotica.",
};

/** Tempo und Pausen – für alle Sätze. */
const FLOW_HINT_BY_LANG: Record<string, string> = {
  de: "Sprich etwa 10 bis 15 Prozent schneller als ein normales ruhiges Gespräch, ohne gehetzt zu wirken. Halte Pausen an Kommas und Semikolons sehr kurz; an Punkten etwas länger.",
  en: "Speak about 10 to 15 percent faster than a calm normal conversation, without sounding rushed. Keep pauses at commas and semicolons very brief; slightly longer at periods.",
  es: "Habla un 10 a 15 por ciento más rápido que una conversación tranquila normal, sin sonar apresurado. Pausas muy breves en comas y punto y coma; un poco más largas en puntos.",
  fr: "Parle environ 10 à 15 pour cent plus vite qu'une conversation calme normale, sans paraître pressé. Pauses très courtes aux virgules et points-virgules ; un peu plus longues aux points.",
  it: "Parla circa il 10–15% più velocemente di una conversazione calma normale, senza sembrare affrettato. Pause molto brevi alle virgole e ai punti e virgola; leggermente più lunghe ai punti.",
};

/** Zusatz nur bei Text mit Fragezeichen – steigende Satzmelodie für Fragen. */
const QUESTION_INTONATION_BY_LANG: Record<string, string> = {
  de: "Bei Sätzen mit Fragezeichen am Ende: deutlich steigende Satzmelodie, als stellst du wirklich eine Frage und erwartest eine Antwort. Fragen dürfen niemals wie neutrale Aussagesätze klingen.",
  en: "For sentences ending with a question mark: use clearly rising intonation, as if you genuinely expect an answer. Questions must never sound like neutral statements.",
  es: "En oraciones que terminan con signo de interrogación: entonación claramente ascendente, como si esperaras una respuesta real. Las preguntas nunca deben sonar como afirmaciones neutras.",
  fr: "Pour les phrases se terminant par un point d'interrogation : intonation clairement montante, comme si tu attendais vraiment une réponse. Les questions ne doivent jamais sonner comme des affirmations neutres.",
  it: "Per le frasi che terminano con un punto interrogativo: intonazione chiaramente ascendente, come se ti aspettassi davvero una risposta. Le domande non devono mai suonare come affermazioni neutre.",
};

const DEFAULT_INSTRUCTIONS =
  "Speak like a professional business consultant. Natural, friendly, confident and fluent. Avoid robotic intonation.";

const DEFAULT_FLOW_HINT =
  "Speak about 10 to 15 percent faster than a calm normal conversation, without sounding rushed. Keep pauses at commas and semicolons very brief; slightly longer at periods.";

const DEFAULT_QUESTION_INTONATION =
  "For sentences ending with a question mark: use clearly rising intonation, as if you genuinely expect an answer. Questions must never sound like neutral statements.";

export function getTtsInstructionsForLang(lang: string, text?: string): string {
  const prefix = lang.split("-")[0].toLowerCase();
  const base = INSTRUCTIONS_BY_LANG[prefix] ?? DEFAULT_INSTRUCTIONS;
  const flowHint = FLOW_HINT_BY_LANG[prefix] ?? DEFAULT_FLOW_HINT;

  if (!text?.includes("?")) {
    return `${base} ${flowHint}`;
  }

  const questionHint =
    QUESTION_INTONATION_BY_LANG[prefix] ?? DEFAULT_QUESTION_INTONATION;
  return `${base} ${flowHint} ${questionHint}`;
}
