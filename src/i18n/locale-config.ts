/**
 * Zentrale Locale-Konfiguration für AVYZOR
 *
 * Aktive Sprachen der öffentlichen Website.
 * Neue Sprache hinzufügen: Eintrag in LOCALE_DEFINITIONS ergänzen,
 * Ordner src/messages/{code}/ anlegen – Routing, Middleware,
 * LanguageSwitcher und Message-Loader übernehmen den Rest automatisch.
 */

export const LOCALE_DEFINITIONS = [
  {
    code: "de",
    label: "Deutsch",
    shortLabel: "DE",
    bcp47: "de-DE",
    og: "de_DE",
    intl: "de-DE",
    language: "German",
  },
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    bcp47: "en-US",
    og: "en_US",
    intl: "en-US",
    language: "English",
  },
  {
    code: "es",
    label: "Español",
    shortLabel: "ES",
    bcp47: "es-ES",
    og: "es_ES",
    intl: "es-ES",
    language: "Spanish",
  },
  {
    code: "fr",
    label: "Français",
    shortLabel: "FR",
    bcp47: "fr-FR",
    og: "fr_FR",
    intl: "fr-FR",
    language: "French",
  },
  {
    code: "it",
    label: "Italiano",
    shortLabel: "IT",
    bcp47: "it-IT",
    og: "it_IT",
    intl: "it-IT",
    language: "Italian",
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

export function isSupportedLocale(code: string): code is Locale {
  return locales.includes(code as Locale);
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

/** Cookie-Name für gespeicherte Sprachwahl (next-intl). */
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

/** Gültigkeit der Sprachwahl in Sekunden (365 Tage). */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
