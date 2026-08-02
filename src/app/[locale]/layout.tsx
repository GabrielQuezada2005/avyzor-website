import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AssistantWidgetLazy } from "@/components/assistant/AssistantWidgetLazy";
import { SkipLink } from "@/components/layout/SkipLink";
import { routing, type Locale } from "@/i18n/routing";
import {
  buildSiteLayoutMetadata,
  buildSiteStructuredDataJsonLd,
} from "@/lib/seo";
import { fontVariables } from "@/lib/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "metadata" });
  const serviceTypes = t.raw("jsonLd.serviceTypes") as string[];

  const structuredData = buildSiteStructuredDataJsonLd(locale, serviceTypes);

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className="antialiased bg-dark-900 text-white font-sans min-h-screen"
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <AssistantWidgetLazy />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
