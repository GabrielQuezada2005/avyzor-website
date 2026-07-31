import type { AbstractIntlMessages } from "next-intl";
import type { Locale } from "@/i18n/routing";

const loaders: Record<Locale, () => Promise<{ default: unknown }>> = {
  de: () => import("./de"),
  en: () => import("./en"),
  es: () => import("./es"),
  fr: () => import("./fr"),
  it: () => import("./it"),
};

export async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  const loader = loaders[locale as Locale] ?? loaders.de;
  const messageModule = await loader();
  return messageModule.default as AbstractIntlMessages;
}
