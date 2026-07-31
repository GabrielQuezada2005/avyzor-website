import type { Locale } from "@/i18n/routing";

const localeToIntl: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
};

export function formatPrice(amount: number, locale: string): string {
  const intlLocale = localeToIntl[locale as Locale] ?? "de-DE";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(date: Date, locale: string): string {
  const intlLocale = localeToIntl[locale as Locale] ?? "de-DE";
  return date.toLocaleTimeString(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
