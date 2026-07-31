/**
 * Branchenerkennung – Branchen-Katalog
 *
 * Single source of truth für Branchen, Keywords und branchenspezifische Empfehlungen.
 */

import type { IndustryDefinition, IndustryId } from "../types";

export const INDUSTRY_CATALOG: IndustryDefinition[] = [
  {
    id: "elektriker",
    label: "Elektriker",
    keywords: [/elektrik|elektriker|elektroinstall|elektro\b|elektrofach/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Lokale SEO und Google Maps",
      "Google-Bewertungen",
      "Notdienst-Hinweis",
      "Online-Terminbuchung",
      "WhatsApp-Kontakt",
      "Referenzprojekte",
    ],
    contextHint:
      "Lokale Sichtbarkeit, schnelle Erreichbarkeit und Vertrauen durch Referenzen sind entscheidend.",
  },
  {
    id: "sanitaer",
    label: "Sanitärbetrieb",
    keywords: [/sanitär|sanitaer|installateur|klempner|badumbau|rohr/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Lokale SEO",
      "Notdienst-Bereich",
      "Terminbuchung",
      "Referenzprojekte",
      "Google-Bewertungen",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Notfälle und lokale Auffindbarkeit sind zentral – Vertrauen durch Referenzen.",
  },
  {
    id: "heizung",
    label: "Heizungsbauer",
    keywords: [/heizung|heizungsbau|wärmepumpe|kessel|klima/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Lokale SEO",
      "Wartungs- und Servicebereich",
      "Terminbuchung",
      "Referenzprojekte",
      "Google-Bewertungen",
      "Energieberatung-Hinweis",
    ],
    contextHint:
      "Serviceverträge, Wartung und regionale Expertise sind wichtige Verkaufsargumente.",
  },
  {
    id: "dachdecker",
    label: "Dachdecker",
    keywords: [/dachdecker|dach\b|bedachung|dachsanierung|ziegel/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Lokale SEO",
      "Referenzprojekte mit Vorher/Nachher",
      "Google-Bewertungen",
      "Anfrageformular",
      "Notdienst bei Sturmschäden",
    ],
    contextHint:
      "Visuelle Referenzen und regionale Präsenz überzeugen bei Dachprojekten.",
  },
  {
    id: "maler",
    label: "Maler",
    keywords: [/maler|malerei|anstrich|tapezier|lackier/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Referenzgalerie",
      "Lokale SEO",
      "Google-Bewertungen",
      "Anfrageformular",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Bildstarke Referenzen und lokale Sichtbarkeit sind der Haupthebel.",
  },
  {
    id: "schreiner",
    label: "Schreiner",
    keywords: [/schreiner|tischler|schreinerei|möbelbau|holzwerk/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Referenzgalerie",
      "Individuelle Anfrage",
      "Lokale SEO",
      "Google-Bewertungen",
      "Maßanfertigung hervorheben",
    ],
    contextHint:
      "Handwerkliche Qualität und individuelle Projekte sollten visuell überzeugen.",
  },
  {
    id: "garten",
    label: "Garten- und Landschaftsbau",
    keywords: [
      /garten|landschaftsbau|galabau|gartengestalt|rasen|bepflanz/i,
    ],
    recommendationCategory: "handwerk",
    priorities: [
      "Referenzgalerie",
      "Saisonale Angebote",
      "Lokale SEO",
      "Anfrageformular",
      "Google-Bewertungen",
    ],
    contextHint:
      "Vorher/Nachher-Bilder und saisonale Leistungen treiben Anfragen.",
  },
  {
    id: "kfz-werkstatt",
    label: "KFZ-Werkstatt",
    keywords: [/kfz|werkstatt|autowerkstatt|fahrzeug|inspektion|reparatur/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Online-Terminbuchung",
      "Leistungsübersicht",
      "Google Maps und Bewertungen",
      "Notfall-/Pannenhinweis",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Terminbuchung reduziert Telefonaufwand – Bewertungen schaffen Vertrauen.",
  },
  {
    id: "autohaus",
    label: "Autohaus",
    keywords: [/autohaus|fahrzeughandel|gebrauchtwagen|neuwagen|händler/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Fahrzeugbestand",
      "Probefahrt-Anfrage",
      "Finanzierungs-Hinweis",
      "Google-Bewertungen",
      "Mobile Optimierung",
    ],
    contextHint:
      "Fahrzeugpräsentation und einfache Kontaktaufnahme sind entscheidend.",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    keywords: [/restaurant|gastronomie|gastro\b|speise|küche/i],
    recommendationCategory: "gastro",
    priorities: [
      "Online-Reservierung",
      "Digitale Speisekarte",
      "Google Maps",
      "Bewertungen",
      "Lieferdienst-Anbindung",
      "Mobile Optimierung",
    ],
    contextHint:
      "Reservierung und Speisekarte online entlasten das Team und bringen Gäste.",
  },
  {
    id: "cafe",
    label: "Café",
    keywords: [/café|cafe\b|bäckerei|konditorei|coffee/i],
    recommendationCategory: "gastro",
    priorities: [
      "Speisekarte",
      "Öffnungszeiten",
      "Google Maps",
      "Bewertungen",
      "Mobile Optimierung",
      "Social-Media-Verknüpfung",
    ],
    contextHint:
      "Atmosphäre, Speisekarte und lokale Auffindbarkeit stehen im Vordergrund.",
  },
  {
    id: "hotel",
    label: "Hotel",
    keywords: [/hotel|pension|gästehaus|übernacht|zimmer/i],
    recommendationCategory: "gastro",
    priorities: [
      "Direktbuchung",
      "Zimmerpräsentation",
      "Google Maps und Bewertungen",
      "Mehrsprachigkeit",
      "Mobile Optimierung",
    ],
    contextHint:
      "Direktbuchungen sparen Provisionen – Bilder und Bewertungen entscheiden.",
  },
  {
    id: "zahnarzt",
    label: "Zahnarzt",
    keywords: [/zahnarzt|zahnärzt|zahnmedizin|zahnarztpraxis/i],
    recommendationCategory: "medtech",
    priorities: [
      "Online-Terminbuchung",
      "DSGVO-konforme Darstellung",
      "Patienteninformationen",
      "Leistungsspektrum",
      "Kontakt und Anfahrt",
    ],
    contextHint:
      "Vertrauen, Datenschutz und einfache Terminbuchung sind Pflicht.",
  },
  {
    id: "arzt",
    label: "Arztpraxis",
    keywords: [
      /arztpraxis|hausarzt|facharzt|praxis\b|medizin|klinik|arzt\b/i,
    ],
    recommendationCategory: "medtech",
    priorities: [
      "Terminbuchung",
      "Datenschutz",
      "Patienteninformationen",
      "Öffnungszeiten",
      "Kontakt und Notfallhinweise",
    ],
    contextHint:
      "Patienten brauchen klare Infos, Vertrauen und unkomplizierte Terminvergabe.",
  },
  {
    id: "physiotherapie",
    label: "Physiotherapie",
    keywords: [/physio|physiotherap|krankengymnast|rehabilitation/i],
    recommendationCategory: "medtech",
    priorities: [
      "Online-Terminbuchung",
      "Leistungsübersicht",
      "Teamvorstellung",
      "Kontakt",
      "DSGVO-konforme Darstellung",
    ],
    contextHint:
      "Terminbuchung und Vertrauen durch Team und Leistungen sind zentral.",
  },
  {
    id: "fitness",
    label: "Fitnessstudio",
    keywords: [/fitness|fitnessstudio|gym\b|training|sportstudio/i],
    recommendationCategory: "fitness",
    priorities: [
      "Probetraining-Anfrage",
      "Kursplan",
      "Mitgliedschaft-Info",
      "Google-Bewertungen",
      "Mobile Optimierung",
    ],
    contextHint:
      "Probetraining und Kursangebot online steigern Neukunden.",
  },
  {
    id: "friseur",
    label: "Friseursalon",
    keywords: [/friseur|friseursalon|salon\b|haarschnitt|barbershop/i],
    recommendationCategory: "friseur",
    priorities: [
      "Online-Terminbuchung",
      "Lokale SEO",
      "Google-Bewertungen",
      "Preisübersicht oder Leistungen",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Terminbuchung reduziert Telefonstress und füllt freie Slots.",
  },
  {
    id: "kosmetik",
    label: "Kosmetikstudio",
    keywords: [/kosmetik|kosmetikstudio|beauty|nagelstudio|wellness/i],
    recommendationCategory: "friseur",
    priorities: [
      "Online-Terminbuchung",
      "Behandlungsübersicht",
      "Google-Bewertungen",
      "Lokale SEO",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Terminbuchung und Vertrauen durch Bewertungen und Behandlungsinfos.",
  },
  {
    id: "anwalt",
    label: "Anwaltskanzlei",
    keywords: [/anwalt|anwält|kanzlei|rechtsanwalt|jurist/i],
    recommendationCategory: "beratung",
    priorities: [
      "Vertrauen aufbauen",
      "Fachgebiete klar darstellen",
      "Kontaktaufnahme",
      "Hochwertige Außendarstellung",
      "Mandanteninformationen",
    ],
    contextHint:
      "Seriosität, Fachgebiete und diskrete Kontaktaufnahme sind entscheidend.",
  },
  {
    id: "steuerberater",
    label: "Steuerberater",
    keywords: [/steuerberater|steuerkanzlei|buchhaltung|steuer\b/i],
    recommendationCategory: "beratung",
    priorities: [
      "Vertrauen und Seriosität",
      "Leistungsspektrum",
      "Kontaktaufnahme",
      "Mandanteninformationen",
      "DSGVO-konforme Darstellung",
    ],
    contextHint:
      "Vertrauen und klare Leistungsdarstellung überzeugen Mandanten.",
  },
  {
    id: "immobilien",
    label: "Immobilienmakler",
    keywords: [/immobilien|makler|wohnung|hausverkauf|mietobjekt/i],
    recommendationCategory: "immobilien",
    priorities: [
      "Objektpräsentation",
      "Lead-Qualifizierung",
      "Vertrauensaufbau",
      "Kontaktformular",
      "Lokale SEO",
    ],
    contextHint:
      "Objekte überzeugend präsentieren und qualifizierte Anfragen generieren.",
  },
  {
    id: "architekt",
    label: "Architekt",
    keywords: [/architekt|architekturbüro|planung|bauplan/i],
    recommendationCategory: "beratung",
    priorities: [
      "Projektportfolio",
      "Vertrauensaufbau",
      "Leistungsspektrum",
      "Kontaktaufnahme",
      "Hochwertige Bildsprache",
    ],
    contextHint:
      "Referenzprojekte und professionelle Präsentation sind das A und O.",
  },
  {
    id: "unternehmensberatung",
    label: "Unternehmensberatung",
    keywords: [
      /unternehmensberat|managementberat|consulting|berater\b/i,
    ],
    recommendationCategory: "beratung",
    priorities: [
      "Expertise darstellen",
      "Fallstudien",
      "Kontaktaufnahme",
      "Vertrauensaufbau",
      "Klare Positionierung",
    ],
    contextHint:
      "Kompetenz durch Fallstudien und klare Positionierung vermitteln.",
  },
  {
    id: "software",
    label: "Softwareunternehmen",
    keywords: [
      /software|saas|app.?entwick|programmier|it.?unternehmen|tech.?startup/i,
    ],
    recommendationCategory: "agentur",
    priorities: [
      "Produktpräsentation",
      "Use Cases",
      "Demo-Anfrage",
      "Technische Glaubwürdigkeit",
      "Conversion-optimierte Landingpage",
    ],
    contextHint:
      "Produktnutzen und technische Glaubwürdigkeit müssen sofort erkennbar sein.",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    keywords: [
      /e-commerce|ecommerce|online.?shop|onlineshop|webshop|verkauf.?online/i,
    ],
    recommendationCategory: "ecommerce",
    priorities: [
      "Shop-Optimierung",
      "Conversion",
      "Produktpräsentation",
      "Checkout-Prozess",
      "Performance und Mobile",
    ],
    contextHint:
      "Conversion, Performance und mobiles Einkaufserlebnis sind entscheidend.",
  },
  {
    id: "coaching",
    label: "Coaching",
    keywords: [/coaching|coach\b|trainer\b|mentoring|seminar/i],
    recommendationCategory: "beratung",
    priorities: [
      "Vertrauensaufbau",
      "Angebotsübersicht",
      "Terminbuchung",
      "Testimonials",
      "Klare Positionierung",
    ],
    contextHint:
      "Persönliche Marke, Vertrauen und einfache Buchung stehen im Fokus.",
  },
  {
    id: "fotograf",
    label: "Fotograf",
    keywords: [/fotograf|fotografie|fotostudio|hochzeit.?foto/i],
    recommendationCategory: "agentur",
    priorities: [
      "Portfolio-Galerie",
      "Buchungsanfrage",
      "Referenzen",
      "Mobile Optimierung",
      "Social Proof",
    ],
    contextHint: "Bildstarke Referenzen und einfache Anfrage sind der Kern.",
  },
  {
    id: "event",
    label: "Eventagentur",
    keywords: [/event|veranstalt|eventagentur|messe|hochzeit/i],
    recommendationCategory: "agentur",
    priorities: [
      "Referenzprojekte",
      "Leistungsübersicht",
      "Anfrageformular",
      "Vertrauensaufbau",
      "Bildstarke Präsentation",
    ],
    contextHint:
      "Referenzen und emotionale Bildsprache überzeugen Eventkunden.",
  },
  {
    id: "versicherung",
    label: "Versicherung",
    keywords: [/versicherung|versicherungsmakler|versicherungsberater/i],
    recommendationCategory: "fintech",
    priorities: [
      "Vertrauensaufbau",
      "Leistungsübersicht",
      "Kontaktaufnahme",
      "Beratungstermin",
      "DSGVO-konforme Darstellung",
    ],
    contextHint:
      "Vertrauen und persönliche Beratung stehen vor Feature-Listen.",
  },
  {
    id: "finanzberatung",
    label: "Finanzberatung",
    keywords: [
      /finanzberat|finanzplan|vermögen|investment|finanzdienstleist/i,
    ],
    recommendationCategory: "fintech",
    priorities: [
      "Vertrauensaufbau",
      "Leistungsspektrum",
      "Beratungstermin",
      "Referenzen",
      "Seriöse Außendarstellung",
    ],
    contextHint:
      "Seriosität und Vertrauen sind wichtiger als technische Features.",
  },
  {
    id: "handwerk",
    label: "Handwerk (allgemein)",
    keywords: [/handwerk|handwerker|meisterbetrieb|betrieb\b/i],
    recommendationCategory: "handwerk",
    priorities: [
      "Lokale SEO",
      "Google-Bewertungen",
      "Referenzprojekte",
      "Anfrageformular",
      "WhatsApp-Kontakt",
    ],
    contextHint:
      "Lokale Sichtbarkeit und Vertrauen – bei Bedarf Branche gezielt nachfragen.",
  },
];

export const INDUSTRY_BY_ID: Record<IndustryId, IndustryDefinition> =
  Object.fromEntries(
    INDUSTRY_CATALOG.map((d) => [d.id, d])
  ) as Record<IndustryId, IndustryDefinition>;

export const INDUSTRY_LABELS: Record<IndustryId, string> = Object.fromEntries(
  INDUSTRY_CATALOG.map((d) => [d.id, d.label])
) as Record<IndustryId, string>;

/** Grobe Kategorie für Paket-Matching – kompatibel mit recommendations/. */
export function mapIndustryToRecommendationCategory(
  industryId: IndustryId | null
): string | null {
  if (!industryId) return null;
  return INDUSTRY_BY_ID[industryId]?.recommendationCategory ?? null;
}
