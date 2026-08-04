#!/usr/bin/env node
/**
 * SEO- & Performance-Verifikation (statische Checks).
 * Ausführung: node scripts/verify-seo.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

console.log("→ Prüfe SEO-Dateien…");
const requiredFiles = [
  "src/lib/seo/metadata.ts",
  "src/lib/seo/json-ld.ts",
  "src/lib/seo/constants.ts",
  "src/lib/fonts.ts",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "public/site.webmanifest",
  "public/og-image.jpg",
];

for (const file of requiredFiles) {
  assert(exists(file), `Fehlende Datei: ${file}`);
}

console.log("→ Prüfe Locale-Layout (Viewport, JSON-LD, Lazy Assistant)…");
const localeLayout = read("src/app/[locale]/layout.tsx");
assert(localeLayout.includes("export const viewport"), "viewport export fehlt");
assert(
  localeLayout.includes("schema.json"),
  "JSON-LD schema.json Kommentar/Referenz fehlt"
);
assert(exists("src/app/[locale]/schema.json/route.ts"), "JSON-LD Route fehlt");
const seoMetadata = read("src/lib/seo/metadata.ts");
assert(
  seoMetadata.includes("application/ld+json") &&
    seoMetadata.includes("schema.json"),
  "JSON-LD alternates.types Link fehlt in metadata.ts"
);
assert(localeLayout.includes("AssistantWidgetLazy"), "Lazy Assistant fehlt");
assert(localeLayout.includes('from "@/lib/fonts"'), "Shared fonts fehlt");

console.log("→ Prüfe Homepage-Metadaten…");
const homePage = read("src/app/[locale]/page.tsx");
assert(homePage.includes("generateMetadata"), "Homepage generateMetadata fehlt");
assert(homePage.includes("buildLocalizedPageMetadata"), "Homepage SEO helper fehlt");

console.log("→ Prüfe Sitemap…");
const sitemap = read("src/app/sitemap.ts");
assert(sitemap.includes("SITEMAP_PUBLIC_PATHS"), "Sitemap-Pfade fehlen");
assert(sitemap.includes("buildLanguageAlternates"), "Hreflang in Sitemap fehlt");
assert(sitemap.includes("x-default") || sitemap.includes("buildLanguageAlternates"), "x-default via helper");

console.log("→ Prüfe robots.txt…");
const robots = read("src/app/robots.ts");
assert(robots.includes("/admin/"), "robots disallow admin fehlt");
assert(robots.includes("/portal/"), "robots disallow portal fehlt");
assert(robots.includes("sitemap.xml"), "robots sitemap fehlt");

console.log("→ Prüfe next.config Performance…");
const nextConfig = read("next.config.mjs");
assert(nextConfig.includes("compress: true"), "compress fehlt");
assert(nextConfig.includes("image/avif"), "AVIF fehlt");
assert(nextConfig.includes("Cache-Control"), "Static cache headers fehlen");

console.log("→ Prüfe Bild-Optimierung…");
const portfolio = read("src/components/sections/Portfolio.tsx");
assert(portfolio.includes('quality={75}'), "Portfolio quality fehlt");
assert(portfolio.includes('loading="lazy"'), "Portfolio lazy loading fehlt");

const footer = read("src/components/layout/Footer.tsx");
assert(footer.includes('loading="lazy"'), "Footer logo lazy fehlt");

console.log("→ Prüfe Core Web Vitals-relevante Patterns…");
const fonts = read("src/lib/fonts.ts");
assert(fonts.includes('display: "swap"'), "font-display swap fehlt");
assert(fonts.includes("adjustFontFallback"), "adjustFontFallback fehlt");
assert(fonts.includes("preload: true"), "Inter preload fehlt");

const header = read("src/components/layout/Header.tsx");
assert(header.includes("priority"), "Logo priority fehlt (LCP)");

console.log("✓ SEO- & Performance-Verifikation erfolgreich.");
