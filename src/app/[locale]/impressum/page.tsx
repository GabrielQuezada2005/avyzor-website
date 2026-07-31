import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "legal.imprint" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_CONFIG.url}/${locale}/impressum`,
    },
  };
}

export default async function ImpressumPage() {
  const t = await getTranslations("legal.imprint");
  const sections = t.raw("sections") as LegalSection[];
  const { legal, address } = SITE_CONFIG;

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-white mb-8">
          {t("title")}
        </h1>

        <div className="prose prose-invert prose-gold space-y-8 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              {sections[0].heading}
            </h2>
            <p>
              {legal.name}
              <br />
              {address.street && (
                <>
                  {address.street}
                  <br />
                </>
              )}
              {address.zip} {address.city}
              <br />
              {address.country}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              {sections[1].heading}
            </h2>
            <p>
              {SITE_CONFIG.phone && (
                <>
                  Telefon: {SITE_CONFIG.phone}
                  <br />
                </>
              )}
              E-Mail:{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold-400 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
          </section>

          {legal.representative && (
            <section>
              <h2 className="text-xl font-semibold text-gold-400 mb-4">
                {sections[2].heading}
              </h2>
              <p>
                {legal.representative}
                {address.street && (
                  <>
                    <br />
                    {address.street}
                    <br />
                    {address.zip} {address.city}
                  </>
                )}
              </p>
            </section>
          )}

          {legal.vatId && (
            <section>
              <h2 className="text-xl font-semibold text-gold-400 mb-4">
                {sections[3].heading}
              </h2>
              <p>
                {sections[3].paragraphs?.[0]} {legal.vatId}
              </p>
            </section>
          )}

          {(legal.registerCourt || legal.registerNumber) && (
            <section>
              <h2 className="text-xl font-semibold text-gold-400 mb-4">
                {sections[4].heading}
              </h2>
              <p>
                {legal.registerCourt && (
                  <>Registergericht: {legal.registerCourt}<br /></>
                )}
                {legal.registerNumber && (
                  <>Registernummer: {legal.registerNumber}</>
                )}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              {sections[5].heading}
            </h2>
            {sections[5].subsections?.map((subsection) => (
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

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              {sections[6].heading}
            </h2>
            {sections[6].paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </section>
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
