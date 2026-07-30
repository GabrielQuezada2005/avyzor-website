import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der AVYZOR Premium KI-Agentur",
  alternates: {
    canonical: `${SITE_CONFIG.url}/impressum`,
  },
};

export default function ImpressumPage() {
  const { legal, address } = SITE_CONFIG;

  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-white mb-8">
          Impressum
        </h1>

        <div className="prose prose-invert prose-gold space-y-8 text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              Angaben gemäß § 5 TMG
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
              Kontakt
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
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
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
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{" "}
                {legal.vatId}
              </p>
            </section>
          )}

          {(legal.registerCourt || legal.registerNumber) && (
            <section>
              <h2 className="text-xl font-semibold text-gold-400 mb-4">
                Handelsregister
              </h2>
              <p>
                {legal.registerCourt && <>Registergericht: {legal.registerCourt}<br /></>}
                {legal.registerNumber && <>Registernummer: {legal.registerNumber}</>}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              Haftungsausschluss
            </h2>
            <h3 className="text-lg font-medium text-white/90 mb-2">
              Haftung für Inhalte
            </h3>
            <p className="mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen.
            </p>
            <h3 className="text-lg font-medium text-white/90 mb-2">
              Haftung für Links
            </h3>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
