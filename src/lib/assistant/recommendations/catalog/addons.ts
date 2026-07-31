/**
 * Empfehlungssystem – Zusatzleistungs-Katalog
 *
 * Modular erweiterbar: neue Leistung = neuer Eintrag in ADDON_CATALOG.
 */

import type { AddOnDefinition } from "../types";

export const ADDON_CATALOG: AddOnDefinition[] = [
  {
    id: "seo",
    name: "SEO",
    feature: "seo",
    keywords: [/seo|suchmaschine|google ranking|sichtbarkeit|organisch|keyword/i],
    reasonTemplates: [
      "Mehr organische Sichtbarkeit in Ihrer Region",
      "Langfristige Kundengewinnung über Google",
    ],
    includedInPackages: ["starter", "professional", "enterprise"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    feature: "google-ads",
    keywords: [/google ads|adwords|anzeigen|paid search|sem\b/i],
    minLeadScore: 26,
    reasonTemplates: [
      "Schnellere Sichtbarkeit bei konkreten Suchbegriffen",
      "Gezielte Anfragen in Ihrer Branche",
    ],
    includedInPackages: [],
  },
  {
    id: "ki-chatbot",
    name: "KI-Chatbot",
    feature: "chatbot",
    keywords: [/chatbot|ki.?bot|bot|24.?7|automatische antwort/i],
    reasonTemplates: [
      "Kundenanfragen rund um die Uhr qualifizieren",
      "Entlastung Ihres Teams bei wiederkehrenden Fragen",
    ],
    includedInPackages: ["professional", "enterprise"],
  },
  {
    id: "crm",
    name: "CRM-Integration",
    feature: "crm",
    keywords: [/crm|hubspot|salesforce|kundendaten|lead.?management/i],
    industries: ["immobilien", "beratung", "agentur"],
    reasonTemplates: [
      "Nahtloser Datenfluss zwischen Website und Vertrieb",
      "Keine Anfrage geht verloren",
    ],
    includedInPackages: ["professional", "enterprise"],
  },
  {
    id: "terminbuchung",
    name: "Terminbuchung",
    feature: "terminbuchung",
    keywords: [/terminbuchung|online.?termin|kalender|buchungssystem/i],
    industries: ["friseur", "fitness", "arzt", "beratung", "handwerk"],
    reasonTemplates: [
      "Weniger Telefonaufwand durch Online-Termine",
      "Mehr Buchungen außerhalb der Geschäftszeiten",
    ],
    includedInPackages: ["starter", "professional", "enterprise"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp-Integration",
    feature: "whatsapp",
    keywords: [/whatsapp|wa\.me|messenger/i],
    reasonTemplates: [
      "Direkter Kontakt über den bevorzugten Kanal Ihrer Kunden",
      "Schnellere Reaktionszeiten bei Anfragen",
    ],
    includedInPackages: [],
  },
  {
    id: "automatisierung",
    name: "Automatisierungen",
    feature: "automatisierung",
    keywords: [/automatisier|workflow|prozess|n8n|make\.com/i],
    minLeadScore: 40,
    reasonTemplates: [
      "Zeitersparnis bei wiederkehrenden Aufgaben",
      "Effizientere Abläufe ohne Mehraufwand",
    ],
    includedInPackages: ["professional", "enterprise"],
  },
  {
    id: "wartung",
    name: "Wartung & Support",
    feature: "wartung",
    keywords: [/wartung|support|pflege|updates|monitoring/i],
    reasonTemplates: [
      "Sicherheit und Performance dauerhaft sichern",
      "Keine Sorgen um technische Updates",
    ],
    includedInPackages: ["starter", "professional", "enterprise"],
  },
  {
    id: "hosting",
    name: "Hosting",
    feature: "hosting",
    keywords: [/hosting|server|domain|ssl/i],
    reasonTemplates: [
      "Schnelle, sichere Auslieferung Ihrer Website",
      "Professionelles Setup ohne technischen Aufwand",
    ],
    includedInPackages: ["starter", "professional", "enterprise"],
  },
  {
    id: "performance",
    name: "Performance-Optimierung",
    feature: "performance",
    keywords: [/performance|ladezeit|schnell|core web vitals|lighthouse/i],
    reasonTemplates: [
      "Bessere Nutzererfahrung und höhere Conversion",
      "Vorteil bei Google-Rankings durch schnelle Ladezeiten",
    ],
    includedInPackages: ["enterprise"],
  },
];
