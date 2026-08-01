import type { AbstractIntlMessages } from "next-intl";
import { locales, type Locale } from "@/i18n/locale-config";

const loaders = Object.fromEntries(
  locales.map((locale) => [
    locale,
    () => import(`./${locale}`),
  ])
) as Record<Locale, () => Promise<{ default: unknown }>>;

export async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  const loader = loaders[locale as Locale] ?? loaders.de;
  const messageModule = await loader();
  return messageModule.default as AbstractIntlMessages;
}
