/**
 * Zentrale Locale-Konfiguration für AVYZOR
 *
 * Neue Sprachen: Eintrag in LOCALE_DEFINITIONS ergänzen,
 * Ordner src/messages/{code}/ anlegen, Middleware/Routing/Switcher
 * übernehmen die Sprache automatisch.
 */

export const LOCALE_DEFINITIONS = [
  {
    code: "de",
    label: "Deutsch",
    bcp47: "de-DE",
    og: "de_DE",
    intl: "de-DE",
    language: "German",
  },
  {
    code: "en",
    label: "English",
    bcp47: "en-US",
    og: "en_US",
    intl: "en-US",
    language: "English",
  },
  {
    code: "es",
    label: "Español",
    bcp47: "es-ES",
    og: "es_ES",
    intl: "es-ES",
    language: "Spanish",
  },
  {
    code: "fr",
    label: "Français",
    bcp47: "fr-FR",
    og: "fr_FR",
    intl: "fr-FR",
    language: "French",
  },
  {
    code: "it",
    label: "Italiano",
    bcp47: "it-IT",
    og: "it_IT",
    intl: "it-IT",
    language: "Italian",
  },
  {
    code: "ru",
    label: "Русский",
    bcp47: "ru-RU",
    og: "ru_RU",
    intl: "ru-RU",
    language: "Russian",
  },
  {
    code: "tr",
    label: "Türkçe",
    bcp47: "tr-TR",
    og: "tr_TR",
    intl: "tr-TR",
    language: "Turkish",
  },
  {
    code: "pt",
    label: "Português",
    bcp47: "pt-PT",
    og: "pt_PT",
    intl: "pt-PT",
    language: "Portuguese",
  },
  {
    code: "nl",
    label: "Nederlands",
    bcp47: "nl-NL",
    og: "nl_NL",
    intl: "nl-NL",
    language: "Dutch",
  },
] as const;

export type LocaleDefinition = (typeof LOCALE_DEFINITIONS)[number];
export type Locale = LocaleDefinition["code"];

export const defaultLocale: Locale = "de";

export const locales: readonly Locale[] = LOCALE_DEFINITIONS.map(
  (definition) => definition.code
);

export const localeCodes = locales as unknown as [Locale, ...Locale[]];

export function getLocaleDefinition(
  code: string
): LocaleDefinition | undefined {
  return LOCALE_DEFINITIONS.find((definition) => definition.code === code);
}

export function getLocaleLanguageName(code: string): string {
  return getLocaleDefinition(code)?.language ?? "German";
}

export const localeToBcp47: Record<Locale, string> = Object.fromEntries(
  LOCALE_DEFINITIONS.map((definition) => [definition.code, definition.bcp47])
) as Record<Locale, string>;

export const localeToOg: Record<Locale, string> = Object.fromEntries(
  LOCALE_DEFINITIONS.map((definition) => [definition.code, definition.og])
) as Record<Locale, string>;

export const localeToIntl: Record<Locale, string> = Object.fromEntries(
  LOCALE_DEFINITIONS.map((definition) => [definition.code, definition.intl])
) as Record<Locale, string>;
