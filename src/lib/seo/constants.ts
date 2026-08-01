/**
 * SEO – Konstanten
 */

export const OG_IMAGE = {
  path: "/og-image.jpg",
  width: 1200,
  height: 630,
} as const;

/** Öffentliche Routen in der Sitemap (ohne Locale-Präfix). */
export const SITEMAP_PUBLIC_PATHS = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/impressum", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly" as const, priority: 0.3 },
];

/** Festes Datum für selten geänderte Seiten (stabile Sitemap-Signale). */
export const SITEMAP_LEGAL_LAST_MODIFIED = new Date("2026-01-15");
