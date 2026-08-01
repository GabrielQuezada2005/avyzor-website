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
