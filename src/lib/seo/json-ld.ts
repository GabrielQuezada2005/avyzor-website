import { SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export function buildProfessionalServiceJsonLd(
  locale: Locale,
  serviceTypes: string[]
): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.url}/${locale}`,
    email: SITE_CONFIG.email,
    priceRange: "€€€€",
    areaServed: locale.toUpperCase(),
    serviceType: serviceTypes,
    inLanguage: locale,
  };

  if (SITE_CONFIG.phone) {
    jsonLd.telephone = SITE_CONFIG.phone;
  }

  if (SITE_CONFIG.address.street) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      postalCode: SITE_CONFIG.address.zip,
      addressCountry: SITE_CONFIG.address.country,
    };
  }

  return jsonLd;
}

function stripJsonLdContext(
  node: Record<string, unknown>
): Record<string, unknown> {
  if (!node || typeof node !== "object") {
    return {};
  }

  const { ["@context"]: _context, ...rest } = node;
  return rest;
}

/**
 * Kombiniert mehrere JSON-LD-Entitäten in einem @graph-Root.
 * Safari/WebKit wirft sonst: r["@context"].toLowerCase() auf Top-Level-Arrays.
 */
export function buildSiteStructuredDataJsonLd(
  locale: Locale,
  serviceTypes: string[]
): Record<string, unknown> {
  const graphNodes = [
    buildWebSiteJsonLd(locale),
    buildProfessionalServiceJsonLd(locale, serviceTypes),
  ]
    .filter((node) => node && typeof node === "object")
    .map(stripJsonLdContext);

  return {
    "@context": "https://schema.org",
    "@graph": graphNodes,
  };
}

export function buildWebSiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.url}/${locale}`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}
