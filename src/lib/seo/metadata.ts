import type { Metadata } from "next";
import { defaultLocale, localeToOg, routing, type Locale } from "@/i18n/routing";
import { SITE_CONFIG } from "@/lib/constants";
import { OG_IMAGE } from "./constants";

export interface LocalizedPageMetadataInput {
  locale: Locale;
  /** Pfad ohne Locale, z. B. "" oder "/impressum" */
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImageAlt?: string;
  robots?: Metadata["robots"];
}

function normalizePath(path = ""): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildCanonical(locale: Locale, path = ""): string {
  const normalized = normalizePath(path);
  return `${SITE_CONFIG.url}/${locale}${normalized}`;
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
  const normalized = normalizePath(path);
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${SITE_CONFIG.url}/${loc}${normalized}`])
  ) as Record<string, string>;

  languages["x-default"] = `${SITE_CONFIG.url}/${defaultLocale}${normalized}`;
  return languages;
}

function getTwitterSite(): string | undefined {
  const twitter = SITE_CONFIG.social.twitter;
  if (!twitter) return undefined;

  const match = twitter.match(/(?:twitter|x)\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : undefined;
}

function buildOpenGraphImages(alt: string): NonNullable<Metadata["openGraph"]>["images"] {
  return [
    {
      url: OG_IMAGE.path,
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      alt,
      type: "image/jpeg",
    },
  ];
}

/** Vollständige, lokalisierte Metadaten inkl. OG, Twitter, Canonical & Hreflang. */
export function buildLocalizedPageMetadata(
  input: LocalizedPageMetadataInput
): Metadata {
  const path = normalizePath(input.path);
  const canonical = buildCanonical(input.locale, path);
  const ogImageAlt = input.ogImageAlt ?? input.title;
  const twitterSite = getTwitterSite();

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords ? { keywords: input.keywords } : {}),
    ...(input.robots ? { robots: input.robots } : {}),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: localeToOg[input.locale],
      url: canonical,
      siteName: SITE_CONFIG.name,
      title: input.title,
      description: input.description,
      images: buildOpenGraphImages(ogImageAlt),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [OG_IMAGE.path],
      ...(twitterSite ? { site: twitterSite, creator: twitterSite } : {}),
    },
  };
}

/** Standard-Metadaten für die öffentliche Site (Layout-Ebene). */
export function buildSiteLayoutMetadata(
  locale: Locale,
  input: {
    title: string;
    description: string;
    keywords: string[];
    ogImageAlt: string;
  }
): Metadata {
  const pageMeta = buildLocalizedPageMetadata({
    locale,
    path: "",
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    ogImageAlt: input.ogImageAlt,
    robots: { index: true, follow: true },
  });

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: input.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: input.description,
    keywords: input.keywords,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    category: "technology",
    manifest: "/site.webmanifest",
    icons: {
      icon: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    alternates: pageMeta.alternates,
    openGraph: pageMeta.openGraph,
    twitter: pageMeta.twitter,
    robots: pageMeta.robots,
  };
}
