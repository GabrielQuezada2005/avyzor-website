/**
 * Proaktive Beratung – Chancen-Erkennung
 */

import type { DetectedOpportunity, OpportunityId } from "./types";
import type { ScoringMessage } from "../lead-scoring/types";

interface OpportunityDefinition {
  id: OpportunityId;
  label: string;
  patterns: RegExp[];
  recommendation: string;
  rationale: string;
}

const OPPORTUNITY_CATALOG: OpportunityDefinition[] = [
  {
    id: "terminbuchung",
    label: "Viele telefonische Anfragen",
    patterns: [
      /telefon|anrufe|telefonisch|am telefon|telefonstress|telefonzeit/i,
      /ständig.*(anruf|telefon)|viele.*(anruf|telefon)/i,
    ],
    recommendation: "Online-Terminbuchung",
    rationale:
      "Entlastet Ihr Team und fängt Anfragen außerhalb der Öffnungszeiten ab.",
  },
  {
    id: "local_seo",
    label: "Regionale Ausrichtung",
    patterns: [
      /regional|lokal|in der nähe|umkreis|einzugsgebiet|vor ort/i,
      /standort|stadt|region\b|ortsspezif/i,
    ],
    recommendation: "Lokale SEO und Google Maps",
    rationale:
      "Sorgt dafür, dass Sie in Ihrer Region gefunden werden und qualifizierte Anfragen erhalten.",
  },
  {
    id: "career_page",
    label: "Personalbedarf",
    patterns: [
      /personal|mitarbeiter.*(suchen|finden|gewinnen)|stellen|recruiting/i,
      /fachkräfte|bewerbung|karriere|team.*(aufbau|erweiter)/i,
    ],
    recommendation: "Karriere-Seite",
    rationale:
      "Qualifizierte Bewerber finden Sie direkt über Ihre Website.",
  },
  {
    id: "ai_assistant",
    label: "Wiederkehrende Kundenfragen",
    patterns: [
      /immer wieder.*(fragen|anfragen)|häufig.*(fragen|anfragen)/i,
      /gleiche fragen|standardfragen|faq|kundenfragen/i,
    ],
    recommendation: "KI-Assistent auf der Website",
    rationale:
      "Beantwortet Standardfragen automatisch und qualifiziert Anfragen vor.",
  },
  {
    id: "quote_automation",
    label: "Viele Angebote schreiben",
    patterns: [
      /angebote.*(schreiben|erstellen)|kostenvoranschläge|offerten/i,
      /viel zeit.*angebot|angebotsanfragen/i,
    ],
    recommendation: "Automatisierte Angebotsanfragen",
    rationale:
      "Strukturiert Anfragen und spart Zeit bei der Angebotserstellung.",
  },
  {
    id: "crm_integration",
    label: "Kundenverwaltung",
    patterns: [
      /kundendaten|kundenverwaltung|nachverfolg|lead.*(verlier|vergess)/i,
      /excel.*(kunden|liste)|chaos.*(daten|kunden)/i,
    ],
    recommendation: "CRM-Integration",
    rationale:
      "Keine Anfragen mehr verlieren – alle Kontakte zentral verwalten.",
  },
  {
    id: "ecommerce",
    label: "Online-Verkauf",
    patterns: [
      /online.*(verkauf|verkaufen)|produkte.*(verkauf|shop)/i,
      /umsatz.*(steigern|online)|webshop|online.?shop/i,
    ],
    recommendation: "E-Commerce / Online-Shop",
    rationale:
      "Generiert Verkäufe rund um die Uhr – unabhängig von Öffnungszeiten.",
  },
];

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

/**
 * Erkennt Beratungs-Chancen aus dem Gespräch.
 */
export function detectOpportunities(
  messages: ScoringMessage[]
): DetectedOpportunity[] {
  const text = joinUserText(messages).toLowerCase();
  const detected: DetectedOpportunity[] = [];

  for (const opp of OPPORTUNITY_CATALOG) {
    const matches = opp.patterns.filter((p) => p.test(text));
    if (matches.length === 0) continue;

    detected.push({
      id: opp.id,
      label: opp.label,
      recommendation: opp.recommendation,
      rationale: opp.rationale,
      confidence: Math.min(1, 0.5 + matches.length * 0.2),
    });
  }

  return detected.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}
