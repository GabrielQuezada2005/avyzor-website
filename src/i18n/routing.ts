/**
 * Internationalisierung – Routing-Konfiguration
 *
 * Locales und Mappings werden aus locale-config.ts geladen.
 */

import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  localeToBcp47,
  localeToIntl,
  localeToOg,
  locales,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "./locale-config";

export {
  defaultLocale,
  localeToBcp47,
  localeToIntl,
  localeToOg,
  locales,
  type Locale,
};

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: LOCALE_COOKIE_MAX_AGE,
  },
});
