import { getTranslations } from "next-intl/server";
import { buildSiteStructuredDataJsonLd } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

export async function GET(
  _request: Request,
  { params: { locale } }: { params: { locale: Locale } }
) {
  if (!routing.locales.includes(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: "metadata" });
  const serviceTypes = t.raw("jsonLd.serviceTypes") as string[];
  const structuredData = buildSiteStructuredDataJsonLd(locale, serviceTypes);

  return Response.json(structuredData, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
