const LOCALE_TO_LANGUAGE: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
};

export function buildLocaleInstruction(locale: string): string {
  const language = LOCALE_TO_LANGUAGE[locale] ?? "German";
  return `IMPORTANT: Always respond in ${language}. The user's interface language is ${locale}.`;
}
