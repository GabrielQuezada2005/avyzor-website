import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildLocalizedPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

type LegalSubsection = {
  heading: string;
  paragraphs: string[];
};

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  subsections?: LegalSubsection[];
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

  return buildLocalizedPageMetadata({
    locale,
    path: "/datenschutz",
    title: t("title"),
    description: t("metaDescription"),
    ogImageAlt: t("metaDescription"),
  });
}

export default async function DatenschutzPage() {
  const t = await getTranslations("legal.privacy");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-white mb-8">
          {t("title")}
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-gold-400 mb-4">
                {section.heading}
              </h2>

              {index === 1 && (
                <p className="mb-4">
                  {SITE_CONFIG.legal.name}
                  <br />
                  {SITE_CONFIG.address.street && (
                    <>
                      {SITE_CONFIG.address.street}
                      <br />
                    </>
                  )}
                  {SITE_CONFIG.address.zip} {SITE_CONFIG.address.city}
                  <br />
                  E-Mail: {SITE_CONFIG.email}
                </p>
              )}

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mb-4 last:mb-0">
                  {index === 4 ? (
                    <>
                      {paragraph.replace(/\.$/, "")} unter{" "}
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-gold-400 hover:underline"
                      >
                        {SITE_CONFIG.email}
                      </a>
                      .
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}

              {section.subsections?.map((subsection) => (
                <div key={subsection.heading}>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    {subsection.heading}
                  </h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
