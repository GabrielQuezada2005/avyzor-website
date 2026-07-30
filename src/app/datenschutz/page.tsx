import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der AVYZOR Premium KI-Agentur",
  alternates: {
    canonical: `${SITE_CONFIG.url}/datenschutz`,
  },
};

export default function DatenschutzPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container-premium mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-white mb-8">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="text-lg font-medium text-white/90 mb-2">
              Allgemeine Hinweise
            </h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              2. Verantwortliche Stelle
            </h2>
            <p>
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
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              3. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-lg font-medium text-white/90 mb-2">
              Kontaktformular, Angebotsanfrage & Terminanfrage
            </h3>
            <p className="mb-4">
              Wenn Sie uns über ein Formular kontaktieren, werden Ihre Angaben
              inklusive der von Ihnen angegebenen Kontaktdaten zur Bearbeitung
              der Anfrage gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a
              DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO
              (Vertragsanbahnung). Die Daten werden in unserer Datenbank
              (Supabase) gespeichert und per E-Mail (Resend) an uns übermittelt.
            </p>

            <h3 className="text-lg font-medium text-white/90 mb-2">
              Newsletter (Double-Opt-In)
            </h3>
            <p className="mb-4">
              Bei der Newsletter-Anmeldung speichern wir Ihre E-Mail-Adresse und
              senden Ihnen einen Bestätigungslink. Erst nach Bestätigung
              aktivieren wir Ihr Abonnement. Sie können den Newsletter jederzeit
              abbestellen.
            </p>

            <h3 className="text-lg font-medium text-white/90 mb-2">
              Terminbuchung über Calendly
            </h3>
            <p className="mb-4">
              Bei Nutzung unseres Calendly-Links werden Ihre Daten auf den
              Servern von Calendly LLC (USA) verarbeitet. Es gelten die
              Datenschutzbestimmungen von Calendly.
            </p>

            <h3 className="text-lg font-medium text-white/90 mb-2">
              WhatsApp-Kontakt
            </h3>
            <p className="mb-4">
              Bei Kontakt über WhatsApp gelten die Datenschutzbestimmungen von
              Meta Platforms Ireland Ltd.
            </p>

            <h3 className="text-lg font-medium text-white/90 mb-2">
              KI-Assistant (Demo)
            </h3>
            <p>
              Unser Website-Assistant arbeitet derzeit im Demo-Modus mit
              regelbasierten Antworten. Es werden keine Chat-Inhalte an externe
              KI-Dienste übermittelt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              4. Hosting & Auftragsverarbeiter
            </h2>
            <p className="mb-4">
              Diese Website wird bei <strong>Vercel Inc.</strong> (USA) gehostet.
              Beim Besuch werden Server-Log-Dateien erfasst (Browsertyp,
              Betriebssystem, Referrer URL, IP-Adresse, Uhrzeit).
            </p>
            <p className="mb-2">Weitere Auftragsverarbeiter:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>
                <strong>Supabase Inc.</strong> – Speicherung von
                Formulardaten (EU/US)
              </li>
              <li>
                <strong>Resend Inc.</strong> – E-Mail-Versand (USA)
              </li>
              <li>
                <strong>Stripe Inc.</strong> – Zahlungsabwicklung (USA/EU)
              </li>
              <li>
                <strong>Calendly LLC</strong> – Terminbuchung (USA)
              </li>
            </ul>
            <p>
              Mit allen Auftragsverarbeitern bestehen bzw. werden
              Auftragsverarbeitungsverträge (AVV) gemäß Art. 28 DSGVO
              abgeschlossen. Bei Übermittlungen in Drittländer stützen wir uns
              auf Standardvertragsklauseln der EU-Kommission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              5. Ihre Rechte
            </h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über
              Ihre gespeicherten personenbezogenen Daten, deren Herkunft und
              Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf
              Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren
              Fragen zum Thema personenbezogene Daten können Sie sich jederzeit
              an uns wenden unter{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold-400 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold-400 mb-4">
              6. SSL-Verschlüsselung
            </h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung. Eine
              verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile
              des Browsers von „http://“ auf „https://“ wechselt.
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
