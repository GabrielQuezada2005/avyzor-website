import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactMenuMount } from "@/components/layout/ContactMenuMount";
import { AssistantWidgetLazy } from "@/components/assistant/AssistantWidgetLazy";
import { SkipLink } from "@/components/layout/SkipLink";
import {
  getLocaleDirection,
  LOCALE_DEFINITIONS,
} from "@/i18n/locale-config";
import { routing, type Locale } from "@/i18n/routing";
import {
  buildSiteLayoutMetadata,
} from "@/lib/seo";
import { fontVariables } from "@/lib/fonts";

/** CSP-Nonces sind request-gebunden – kein SSG für Locale-Layout. */
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildSiteLayoutMetadata(locale, {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    ogImageAlt: t("ogImageAlt"),
  });
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getLocaleDirection(locale);
  const languageOptions = LOCALE_DEFINITIONS.map(
    ({ code, label, shortLabel }) => ({ code, label, shortLabel })
  );
  const copyrightYear = new Date().getFullYear();

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body
        className="antialiased bg-dark-900 text-white font-sans min-h-screen"
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}
      >
        {/*
          Do not render <script type="application/ld+json"> in this tree.
          Browsers relocate script nodes; React hydration then throws
          NotFoundError (removeChild) and wipes the page to scripts-only.
          JSON-LD is exposed via /{locale}/schema.json (see metadata alternates).
        */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink />
          <Header languageOptions={languageOptions} />
          <main id="main-content">{children}</main>
          <Footer copyrightYear={copyrightYear} />
          <AssistantWidgetLazy />
          <ContactMenuMount />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
