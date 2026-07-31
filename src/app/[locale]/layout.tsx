import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { SkipLink } from "@/components/layout/SkipLink";
import { routing, localeToOg, type Locale } from "@/i18n/routing";
import { SITE_CONFIG } from "@/lib/constants";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: t("title"),
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    icons: {
      icon: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: localeToOg[locale],
      url: `${SITE_CONFIG.url}/${locale}`,
      siteName: SITE_CONFIG.name,
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${SITE_CONFIG.url}/${loc}`])
      ),
    },
  };
}

function buildJsonLd(locale: Locale) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.url}/${locale}`,
    email: SITE_CONFIG.email,
    priceRange: "€€€€",
    areaServed: locale.toUpperCase(),
    serviceType: [
      "Premium Website Development",
      "AI Chatbot Development",
      "Business Automation",
      "SEO Services",
    ],
  };

  if (SITE_CONFIG.phone) {
    jsonLd.telephone = SITE_CONFIG.phone;
  }

  return jsonLd;
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

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(locale)),
          }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <AssistantWidget />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
