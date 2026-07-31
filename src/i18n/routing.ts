/**
 * Internationalisierung – Routing-Konfiguration
 *
 * Definiert unterstützte Locales und URL-Präfixe für SEO-freundliche Pfade:
 * /de, /en, /es, /fr, /it
 */

import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "es", "fr", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

/** BCP-47 Mapping für Speech API (STT/TTS). */
export const localeToBcp47: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
};

/** OpenGraph locale codes. */
export const localeToOg: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
};
