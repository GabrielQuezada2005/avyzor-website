import { getLocaleLanguageName } from "@/i18n/locale-config";

export function buildLocaleInstruction(locale: string): string {
  const language = getLocaleLanguageName(locale);
  return `IMPORTANT: Always respond in ${language}. The user's interface language is ${locale}.`;
}
