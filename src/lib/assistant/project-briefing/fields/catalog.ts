/**
 * Projektbriefing – Feld-Katalog
 *
 * Neue Felder: Eintrag mit extract-Funktion hinzufügen.
 */

import type { BriefingFieldDefinition } from "../types";
import type { ScoringMessage } from "../../lead-scoring/types";

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function extractFirstMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function extractList(text: string, keywords: RegExp[]): string[] {
  const found: string[] = [];
  for (const kw of keywords) {
    const match = text.match(kw);
    if (match) found.push(match[0].trim());
  }
  return found;
}

export const BRIEFING_FIELD_CATALOG: BriefingFieldDefinition[] = [
  {
    id: "companyName",
    label: "Firmenname",
    category: "client",
    weight: 8,
    askPriority: 90,
    extract: (text) =>
      extractFirstMatch(text, [
        /(?:firma|unternehmen|betrieb|studio|salon|praxis)\s+[„"']?([^„"'.?\n,]{2,40})/i,
        /wir sind (?:die |der )?[„"']?([^„"'.?\n,]{2,40})/i,
        /heiß(?:en|t)\s+[„"']?([^„"'.?\n,]{2,40})/i,
      ]),
  },
  {
    id: "contactPerson",
    label: "Ansprechpartner",
    category: "client",
    weight: 5,
    askPriority: 70,
    extract: (text) =>
      extractFirstMatch(text, [
        /(?:ich bin|mein name ist|name:?)\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)/,
      ]),
  },
  {
    id: "industry",
    label: "Branche",
    category: "client",
    weight: 7,
    askPriority: 85,
    extract: (text) => {
      const industries = [
        "elektriker", "handwerker", "friseur", "immobilien", "arzt", "anwalt",
        "restaurant", "hotel", "fitness", "medtech", "fintech", "gastro",
        "beratung", "agentur", "logistik", "bau", "e-commerce",
      ];
      const lower = text.toLowerCase();
      const match = industries.find((i) => lower.includes(i));
      return match ?? extractFirstMatch(text, [/branche:?\s+([^.\n?]{3,40})/i]);
    },
  },
  {
    id: "companySize",
    label: "Unternehmensgröße",
    category: "client",
    weight: 5,
    askPriority: 60,
    extract: (text) => {
      if (/großunternehmen|500\+|konzern/i.test(text)) return "Großunternehmen";
      if (/\d{2,}\s*mitarbeiter|mittelständ/i.test(text)) return "Mittelstand";
      if (/\d{1,2}\s*mitarbeiter|klein(es)? unternehmen|startup/i.test(text))
        return "Kleinunternehmen";
      if (/selbstständig|einzelunternehmer|solo|freiberufler/i.test(text))
        return "Einzelunternehmen";
      return null;
    },
  },
  {
    id: "location",
    label: "Standort",
    category: "client",
    weight: 5,
    askPriority: 55,
    extract: (text) =>
      extractFirstMatch(text, [
        /(?:standort|region|stadt|in)\s+([A-ZÄÖÜ][a-zäöüß]+(?:[-\s][A-ZÄÖÜ][a-zäöüß]+)?)/,
        /(?:aus|based in)\s+([A-ZÄÖÜ][a-zäöüß]+)/i,
      ]),
  },
  {
    id: "targetAudience",
    label: "Zielgruppe",
    category: "project",
    weight: 6,
    askPriority: 75,
    extract: (text) =>
      extractFirstMatch(text, [
        /zielgruppe:?\s+([^.\n?]{3,60})/i,
        /(?:kunden|klienten) (?:sind|in der)\s+([^.\n?]{3,60})/i,
        /(?:richten|wenden) (?:uns|mich) an\s+([^.\n?]{3,60})/i,
      ]),
  },
  {
    id: "mainGoals",
    label: "Hauptziele",
    category: "project",
    weight: 9,
    askPriority: 95,
    extract: (text) => {
      const goals: string[] = [];
      if (/mehr kunden|kundengewinnung|mehr anfragen/i.test(text))
        goals.push("Mehr Kunden gewinnen");
      if (/sichtbarkeit|google|seo/i.test(text)) goals.push("Bessere Sichtbarkeit");
      if (/umsatz|verkauf/i.test(text)) goals.push("Umsatz steigern");
      if (/terminbuchung|termine/i.test(text)) goals.push("Terminbuchung automatisieren");
      if (/professional|image|vertrauen/i.test(text)) goals.push("Professionelleres Image");
      if (/automatisier/i.test(text)) goals.push("Prozesse automatisieren");
      return goals.length > 0 ? goals.join("; ") : null;
    },
  },
  {
    id: "businessFocus",
    label: "Geschäftsfokus (Anfragen/Verkäufe)",
    category: "project",
    weight: 7,
    askPriority: 93,
    extract: (text) => {
      if (/mehr anfragen|kundengewinnung|leads/i.test(text)) return "Mehr Anfragen";
      if (/verkauf|umsatz|shop|online.?handel/i.test(text)) return "Mehr Verkäufe";
      if (/anfragen.*und.*verkauf|beides/i.test(text)) return "Anfragen und Verkäufe";
      return null;
    },
  },
  {
    id: "currentProblems",
    label: "Aktuelle Probleme",
    category: "project",
    weight: 7,
    askPriority: 80,
    extract: (text) => {
      const problems: string[] = [];
      if (/keine anfragen|zu wenig kunden/i.test(text)) problems.push("Zu wenig Anfragen");
      if (/veraltet|alt(e)? website/i.test(text)) problems.push("Veraltete Website");
      if (/telefon|anrufe/i.test(text)) problems.push("Zu viele Telefonanfragen");
      if (/schlechte erfahrung/i.test(text)) problems.push("Schlechte Agentur-Erfahrung");
      if (/nicht gefunden|unsichtbar/i.test(text)) problems.push("Schlechte Online-Sichtbarkeit");
      return problems.length > 0 ? problems.join("; ") : null;
    },
  },
  {
    id: "budget",
    label: "Budget",
    category: "commercial",
    weight: 8,
    askPriority: 88,
    extract: (text) => {
      const match = text.match(/\b(\d{1,2}\.?\d{3})\s*(€|euro)/i);
      if (match) return `${match[1]} Euro`;
      if (/kein budget|enges budget|knapp/i.test(text)) return "Enges Budget";
      if (/budget/i.test(text))
        return extractFirstMatch(text, [/budget:?\s*([^.\n?]{3,30})/i]);
      return null;
    },
  },
  {
    id: "timeline",
    label: "Zeitrahmen",
    category: "commercial",
    weight: 7,
    askPriority: 82,
    extract: (text) => {
      if (/sofort|asap|dringend|diese woche/i.test(text)) return "Sofort / dringend";
      if (/\d+\s*wochen/i.test(text)) {
        const m = text.match(/(\d+\s*wochen)/i);
        return m?.[1] ?? "Wenige Wochen";
      }
      if (/nächsten monat|in \d+ monat/i.test(text)) return "Nächste Monate";
      if (/später|irgendwann/i.test(text)) return "Später / flexibel";
      return null;
    },
  },
  {
    id: "desiredFeatures",
    label: "Gewünschte Funktionen",
    category: "requirements",
    weight: 8,
    askPriority: 92,
    extract: (text) => {
      const features = extractList(text, [
        /terminbuchung/gi, /chatbot/gi, /online.?shop/gi, /crm/gi,
        /seo/gi, /kontaktformular/gi, /blog/gi, /newsletter/gi,
        /whatsapp/gi, /automatisierung/gi, /analytics/gi,
      ]);
      return features.length > 0 ? Array.from(new Set(features)).join(", ") : null;
    },
  },
  {
    id: "designWishes",
    label: "Designwünsche",
    category: "requirements",
    weight: 4,
    askPriority: 50,
    extract: (text) =>
      extractFirstMatch(text, [
        /design:?\s+([^.\n?]{3,60})/i,
        /(?:modern|minimal|clean|elegant|premium|professionell)[^.?\n]{0,30}/i,
      ]),
  },
  {
    id: "colorPreferences",
    label: "Wunschfarben",
    category: "requirements",
    weight: 3,
    askPriority: 45,
    extract: (text) =>
      extractFirstMatch(text, [
        /(?:farben|farbe|corporate design):?\s+([^.\n?]{3,40})/i,
        /(?:blau|rot|grün|schwarz|weiß|gold|corporate)/i,
      ]),
  },
  {
    id: "hasLogo",
    label: "Firmenlogo",
    category: "requirements",
    weight: 3,
    askPriority: 40,
    extract: (text) => {
      if (/logo.*(haben|vorhanden|ja)/i.test(text)) return "Ja, vorhanden";
      if (/kein logo|logo.*(fehlt|nein|brauchen)/i.test(text)) return "Nein / wird benötigt";
      return null;
    },
  },
  {
    id: "hasCorporateDesign",
    label: "Corporate Design",
    category: "requirements",
    weight: 3,
    askPriority: 38,
    extract: (text) => {
      if (/corporate design|ci\b|cd\b|markenauftritt|designrichtlin/i.test(text)) {
        if (/haben|vorhanden|ja/i.test(text)) return "Ja, vorhanden";
        if (/kein|fehlt|nein|brauchen/i.test(text)) return "Nein / wird benötigt";
        return "Erwähnt";
      }
      return null;
    },
  },
  {
    id: "hasContent",
    label: "Texte und Bilder",
    category: "requirements",
    weight: 4,
    askPriority: 44,
    extract: (text) => {
      if (/texte.*(haben|vorhanden|liegen)|bilder.*(haben|vorhanden)|fotos.*(haben|vorhanden)/i.test(text))
        return "Ja, vorhanden";
      if (/keine texte|texte.*(fehlen|brauchen)|bilder.*(fehlen|brauchen)|content.*(fehlt|brauchen)/i.test(text))
        return "Nein / wird benötigt";
      return null;
    },
  },
  {
    id: "hasCrm",
    label: "CRM vorhanden",
    category: "requirements",
    weight: 4,
    askPriority: 46,
    extract: (text) => {
      if (/crm|hubspot|salesforce|pipedrive/i.test(text)) {
        if (/haben|nutzen|vorhanden|ja/i.test(text)) return "Ja, vorhanden";
        if (/kein|fehlt|nein|brauchen|suchen/i.test(text)) return "Nein / wird benötigt";
        return "Erwähnt";
      }
      return null;
    },
  },
  {
    id: "hasAppointmentBooking",
    label: "Terminbuchung vorhanden",
    category: "requirements",
    weight: 5,
    askPriority: 72,
    extract: (text) => {
      if (/terminbuchung|online.?termin|calendly|buchungssystem/i.test(text)) {
        if (/haben|nutzen|vorhanden|schon|bereits/i.test(text)) return "Ja, vorhanden";
        if (/kein|fehlt|nein|brauchen|wünschen|möchten/i.test(text)) return "Nein / gewünscht";
        return "Erwähnt";
      }
      return null;
    },
  },
  {
    id: "hasDomain",
    label: "Domain vorhanden",
    category: "requirements",
    weight: 3,
    askPriority: 42,
    extract: (text) => {
      if (/domain.*(haben|vorhanden|ja)|\.de\b|\.com\b/i.test(text)) return "Ja";
      if (/keine domain|domain.*(fehlt|neu|brauchen)/i.test(text)) return "Nein / wird benötigt";
      return null;
    },
  },
  {
    id: "integrations",
    label: "Gewünschte Integrationen",
    category: "requirements",
    weight: 5,
    askPriority: 65,
    extract: (text) => {
      const integrations = extractList(text, [
        /hubspot/gi, /salesforce/gi, /calendly/gi, /stripe/gi,
        /google analytics/gi, /mailchimp/gi, /whatsapp/gi,
      ]);
      return integrations.length > 0 ? Array.from(new Set(integrations)).join(", ") : null;
    },
  },
  {
    id: "specialRequirements",
    label: "Besondere Anforderungen",
    category: "requirements",
    weight: 4,
    askPriority: 58,
    extract: (text) => {
      if (/dsgvo|datenschutz|barrierefrei|mehrsprachig|ssl/i.test(text)) {
        const reqs: string[] = [];
        if (/dsgvo|datenschutz/i.test(text)) reqs.push("DSGVO-Konformität");
        if (/barrierefrei/i.test(text)) reqs.push("Barrierefreiheit");
        if (/mehrsprachig/i.test(text)) reqs.push("Mehrsprachigkeit");
        return reqs.join(", ");
      }
      return null;
    },
  },
  {
    id: "competition",
    label: "Konkurrenz",
    category: "context",
    weight: 3,
    askPriority: 35,
    extract: (text) =>
      extractFirstMatch(text, [
        /konkurrenz:?\s+([^.\n?]{3,60})/i,
        /konkurrent(?:en)?\s+([^.\n?]{3,40})/i,
      ]),
  },
  {
    id: "marketingChannels",
    label: "Marketingkanäle",
    category: "context",
    weight: 4,
    askPriority: 48,
    extract: (text) => {
      const channels: string[] = [];
      if (/google ads|adwords/i.test(text)) channels.push("Google Ads");
      if (/instagram|facebook|social media/i.test(text)) channels.push("Social Media");
      if (/seo|suchmaschine/i.test(text)) channels.push("SEO");
      if (/newsletter/i.test(text)) channels.push("Newsletter");
      return channels.length > 0 ? channels.join(", ") : null;
    },
  },
  {
    id: "existingWebsite",
    label: "Bereits vorhandene Website",
    category: "context",
    weight: 6,
    askPriority: 78,
    extract: (text) => {
      if (/keine website|noch keine|bei null|neu starten/i.test(text))
        return "Nein – Neustart";
      if (/habe.*website|bestehende website|alte website|relaunch/i.test(text))
        return "Ja – Relaunch/Optimierung";
      return null;
    },
  },
];

/** Lookup nach Feld-ID. */
export const BRIEFING_FIELD_BY_ID = Object.fromEntries(
  BRIEFING_FIELD_CATALOG.map((f) => [f.id, f])
);
