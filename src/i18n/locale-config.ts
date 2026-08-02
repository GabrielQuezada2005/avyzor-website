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
    dir: "ltr",
  },
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    bcp47: "en-US",
    og: "en_US",
    intl: "en-US",
    language: "English",
    dir: "ltr",
  },
  {
    code: "es",
    label: "Español",
    shortLabel: "ES",
    bcp47: "es-ES",
    og: "es_ES",
    intl: "es-ES",
    language: "Spanish",
    dir: "ltr",
  },
  {
    code: "fr",
    label: "Français",
    shortLabel: "FR",
    bcp47: "fr-FR",
    og: "fr_FR",
    intl: "fr-FR",
    language: "French",
    dir: "ltr",
  },
  {
    code: "it",
    label: "Italiano",
    shortLabel: "IT",
    bcp47: "it-IT",
    og: "it_IT",
    intl: "it-IT",
    language: "Italian",
    dir: "ltr",
  },
  {
    code: "pt",
    label: "Português",
    shortLabel: "PT",
    bcp47: "pt-PT",
    og: "pt_PT",
    intl: "pt-PT",
    language: "Portuguese",
    dir: "ltr",
  },
  {
    code: "nl",
    label: "Nederlands",
    shortLabel: "NL",
    bcp47: "nl-NL",
    og: "nl_NL",
    intl: "nl-NL",
    language: "Dutch",
    dir: "ltr",
  },
  {
    code: "pl",
    label: "Polski",
    shortLabel: "PL",
    bcp47: "pl-PL",
    og: "pl_PL",
    intl: "pl-PL",
    language: "Polish",
    dir: "ltr",
  },
  {
    code: "tr",
    label: "Türkçe",
    shortLabel: "TR",
    bcp47: "tr-TR",
    og: "tr_TR",
    intl: "tr-TR",
    language: "Turkish",
    dir: "ltr",
  },
  {
    code: "ru",
    label: "Русский",
    shortLabel: "RU",
    bcp47: "ru-RU",
    og: "ru_RU",
    intl: "ru-RU",
    language: "Russian",
    dir: "ltr",
  },
  {
    code: "uk",
    label: "Українська",
    shortLabel: "UA",
    bcp47: "uk-UA",
    og: "uk_UA",
    intl: "uk-UA",
    language: "Ukrainian",
    dir: "ltr",
  },
  {
    code: "ar",
    label: "العربية",
    shortLabel: "AR",
    bcp47: "ar-SA",
    og: "ar_SA",
    intl: "ar-SA",
    language: "Arabic",
    dir: "rtl",
  },
  {
    code: "zh",
    label: "中文",
    shortLabel: "ZH",
    bcp47: "zh-CN",
    og: "zh_CN",
    intl: "zh-CN",
    language: "Chinese",
    dir: "ltr",
  },
  {
    code: "ja",
    label: "日本語",
    shortLabel: "JA",
    bcp47: "ja-JP",
    og: "ja_JP",
    intl: "ja-JP",
    language: "Japanese",
    dir: "ltr",
  },
  {
    code: "ko",
    label: "한국어",
    shortLabel: "KO",
    bcp47: "ko-KR",
    og: "ko_KR",
    intl: "ko-KR",
    language: "Korean",
    dir: "ltr",
  },
  {
    code: "hi",
    label: "हिन्दी",
    shortLabel: "HI",
    bcp47: "hi-IN",
    og: "hi_IN",
    intl: "hi-IN",
    language: "Hindi",
    dir: "ltr",
  },
] as const;

export type LocaleDefinition = (typeof LOCALE_DEFINITIONS)[number];
export type Locale = LocaleDefinition["code"];
export type TextDirection = LocaleDefinition["dir"];

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

export function getLocaleDirection(code: string): TextDirection {
  return getLocaleDefinition(code)?.dir ?? "ltr";
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
