import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_CONFIG } from "@/lib/constants";
import {
  buildLanguageAlternates,
  SITEMAP_LEGAL_LAST_MODIFIED,
  SITEMAP_PUBLIC_PATHS,
} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const homepageLastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of SITEMAP_PUBLIC_PATHS) {
      entries.push({
        url: `${SITE_CONFIG.url}/${locale}${route.path}`,
        lastModified:
          route.path === "" ? homepageLastModified : SITEMAP_LEGAL_LAST_MODIFIED,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: buildLanguageAlternates(route.path),
        },
      });
    }
  }

  return entries;
}
