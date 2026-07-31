/**
 * Empfehlungssystem – Bedürfnis-Analyse
 *
 * Extrahiert Ziele, Features und Wachstumspotenzial aus dem Gespräch.
 */

import type { LeadSignals, ScoringMessage } from "../lead-scoring/types";
import type { CustomerNeeds, DetectedFeature, GrowthPotential } from "./types";

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join("\n");
}

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

const FEATURE_PATTERNS: Record<DetectedFeature, RegExp[]> = {
  website: [/website|webseite|homepage|landingpage|online.?präsenz|online gehen/i],
  terminbuchung: [/terminbuchung|online.?termin|kalender|buchung/i],
  chatbot: [/chatbot|ki.?bot|bot\b|24.?7/i],
  seo: [/seo|suchmaschine|google ranking|sichtbarkeit|organisch/i],
  crm: [/crm|hubspot|salesforce|kundendaten/i],
  automatisierung: [/automatisier|workflow|prozess/i],
  "google-ads": [/google ads|adwords|anzeigen schalten/i],
  whatsapp: [/whatsapp|wa\.me/i],
  hosting: [/hosting|domain|ssl/i],
  wartung: [/wartung|support|pflege/i],
  performance: [/performance|ladezeit|schnell/i],
  ecommerce: [/shop|online.?shop|e-commerce|verkaufen/i],
};

const GOAL_PATTERNS: Array<{ pattern: RegExp; goal: string }> = [
  { pattern: /mehr kunden|kundengewinnung|neue kunden|anfragen/i, goal: "Mehr Kunden gewinnen" },
  { pattern: /sichtbarkeit|gefunden werden|google/i, goal: "Bessere Online-Sichtbarkeit" },
  { pattern: /zeit sparen|effizien|entlastung/i, goal: "Zeit sparen und Prozesse entlasten" },
  { pattern: /professional|seriös|vertrauen|image/i, goal: "Professionelleres Erscheinungsbild" },
  { pattern: /umsatz|verkauf|conversion/i, goal: "Umsatz steigern" },
  { pattern: /termin|buchung/i, goal: "Terminbuchung automatisieren" },
  { pattern: /automatisier|prozess/i, goal: "Abläufe automatisieren" },
  { pattern: /wachsen|skalier|expand|filialen|standorte/i, goal: "Unternehmen skalieren" },
];

const INDUSTRY_KEYWORDS: Record<string, RegExp[]> = {
  handwerk: [/handwerk|elektriker|installateur|sanitär|maler/i],
  friseur: [/friseur|salon|kosmetik/i],
  immobilien: [/immobilien|makler|wohnung/i],
  medtech: [/medtech|medizin|arzt|praxis|klinik/i],
  fintech: [/fintech|finanz|versicherung/i],
  gastro: [/restaurant|hotel|gastro|café/i],
  fitness: [/fitness|studio|trainer/i],
  beratung: [/beratung|consulting|coach/i],
  agentur: [/agentur|marketing/i],
  ecommerce: [/shop|e-commerce|online.?handel/i],
};

function detectFeatures(text: string): DetectedFeature[] {
  const detected: DetectedFeature[] = [];
  for (const [feature, patterns] of Object.entries(FEATURE_PATTERNS)) {
    if (containsAny(text, patterns)) {
      detected.push(feature as DetectedFeature);
    }
  }
  return detected;
}

function detectGoals(text: string): string[] {
  const goals: string[] = [];
  for (const { pattern, goal } of GOAL_PATTERNS) {
    if (pattern.test(text) && !goals.includes(goal)) {
      goals.push(goal);
    }
  }
  return goals;
}

function detectIndustry(text: string): string | null {
  for (const [industry, patterns] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (containsAny(text, patterns)) return industry;
  }
  return null;
}

function detectGrowthPotential(
  text: string,
  companySize: LeadSignals["companySize"]
): GrowthPotential {
  if (
    containsAny(text, [
      /skalier|expand|filialen|standorte|wachstum|groß werden|mehr mitarbeiter/,
    ])
  ) {
    return "high";
  }
  if (
    companySize === "medium" ||
    companySize === "large" ||
    containsAny(text, [/wachsen|ausbau|erweiter/i])
  ) {
    return "medium";
  }
  if (containsAny(text, [/irgendwann|später|in zukunft/i])) {
    return "low";
  }
  return "none";
}

/** Mappt Lead-Services-Signal auf Features, wenn Keyword-Erkennung wenig findet. */
function enrichFeaturesFromSignals(
  features: DetectedFeature[],
  signals: LeadSignals
): DetectedFeature[] {
  const enriched = [...features];
  if (signals.services !== "none" && enriched.length === 0) {
    enriched.push("website");
  }
  if (signals.services === "multiple" && !enriched.includes("automatisierung")) {
    enriched.push("automatisierung");
  }
  return enriched;
}

/**
 * Analysiert Kundenbedürfnisse aus Gespräch und Lead-Signalen.
 */
export function analyzeCustomerNeeds(
  messages: ScoringMessage[],
  signals: LeadSignals
): CustomerNeeds {
  const text = joinUserText(messages);

  return {
    goals: detectGoals(text),
    features: enrichFeaturesFromSignals(detectFeatures(text), signals),
    growthPotential: detectGrowthPotential(text, signals.companySize),
    industry: detectIndustry(text),
  };
}
