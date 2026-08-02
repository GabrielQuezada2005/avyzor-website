import {
  getLocaleDefinition,
  getLocaleLanguageName,
} from "@/i18n/locale-config";

export function buildLocaleInstruction(locale: string): string {
  const language = getLocaleLanguageName(locale);
  const definition = getLocaleDefinition(locale);
  const bcp47 = definition?.bcp47 ?? locale;

  return [
    `## OUTPUT LANGUAGE (HIGHEST PRIORITY)`,
    `Write every user-facing word in ${language} (${bcp47}, locale "${locale}").`,
    `This overrides the language of any reference material below.`,
    ``,
    `Style requirements:`,
    `- Sound like a native ${language} business consultant — natural, idiomatic, confident.`,
    `- Do NOT translate sentence-by-sentence from German. Think and phrase directly in ${language}.`,
    `- Avoid calques, awkward word order, literal German idioms, or "machine translated" phrasing.`,
    `- Use the formal/polite address expected in ${language} for premium B2B (e.g. Sie/vous/usted/Lei/Вы/です・ます where appropriate).`,
    `- Keep company name "AVYZOR" and proper nouns unchanged.`,
    `- Euro prices stay in EUR; adapt number formatting to ${language} conventions.`,
    definition?.dir === "rtl"
      ? `- Text direction is RTL — write naturally for Arabic readers.`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
