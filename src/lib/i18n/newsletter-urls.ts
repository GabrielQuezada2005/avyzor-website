import {
  defaultLocale,
  isSupportedLocale,
  type Locale,
} from "@/i18n/locale-config";
import { env } from "@/lib/env";

export function resolveNewsletterLocale(value?: string | null): Locale {
  if (value && isSupportedLocale(value)) {
    return value;
  }
  return defaultLocale;
}

export function newsletterPageUrl(
  path: "/newsletter/bestaetigt" | "/newsletter/fehler",
  locale?: string | null,
  search = ""
): string {
  const resolvedLocale = resolveNewsletterLocale(locale);
  return `${env.siteUrl}/${resolvedLocale}${path}${search}`;
}
