/**
 * Internationalisierung – Server Request Config
 *
 * Lädt Übersetzungen lazy pro Locale (nur die aktive Sprache pro Request).
 */

import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getMessages } from "@/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessages(locale),
  };
});
