/**
 * Lead-Scoring – Signal-Analyse
 *
 * Extrahiert Kaufsignale aus dem Gesprächsverlauf per Keyword-/Heuristik-Analyse.
 * Kein zusätzlicher API-Call – läuft synchron auf dem Server.
 */

import type {
  LeadSignals,
  ScoringMessage,
} from "./types";

const USER_MESSAGES = (messages: ScoringMessage[]) =>
  messages.filter((m) => m.role === "user");

function joinUserText(messages: ScoringMessage[]): string {
  return USER_MESSAGES(messages)
    .map((m) => m.content.toLowerCase())
    .join("\n");
}

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function analyzeBudget(text: string): LeadSignals["budget"] {
  if (
    containsAny(text, [
      /\b(19\.?\d{3}|20\.?\d{3}|25\.?\d{3}|30\.?\d{3})\s*(€|euro)/,
      /enterprise|premium.?paket|großes projekt/,
      /budget.*(20|25|30)/,
    ])
  ) {
    return "premium_budget";
  }
  if (
    containsAny(text, [
      /\b(9\.?\d{3}|10\.?\d{3}|15\.?\d{3}|18\.?\d{3})\s*(€|euro)/,
      /professional|größer(es)? projekt/,
      /budget.*(10|15|18)/,
    ])
  ) {
    return "high_budget";
  }
  if (
    containsAny(text, [
      /\b(4\.?\d{3}|5\.?\d{3}|6\.?\d{3}|7\.?\d{3}|8\.?\d{3})\s*(€|euro)/,
      /starter.?paket|mittleres budget/,
      /budget.*(4|5|6|7|8)/,
    ])
  ) {
    return "medium_budget";
  }
  if (
    containsAny(text, [
      /\b([1-3]\.?\d{3})\s*(€|euro)/,
      /nur \d{3}/,
      /zu teuer|zu wenig|kann ich mir nicht leisten|enges budget|kleines budget/,
      /budget.*([1-3]\.?\d{3})/,
    ])
  ) {
    return "low_budget";
  }
  if (
    containsAny(text, [
      /was kostet|preis|kosten|budget|angebot|paket|investition|wie viel/,
    ])
  ) {
    return "asked_about_price";
  }
  return "none";
}

function analyzeCompanySize(text: string): LeadSignals["companySize"] {
  if (
    containsAny(text, [
      /konzern|großunternehmen|500\+?\s*mitarbeiter|mehrere standorte|filialen/,
    ])
  ) {
    return "large";
  }
  if (
    containsAny(text, [
      /50\+?\s*mitarbeiter|30\+?\s*mitarbeiter|mittelständ|team von \d{2}/,
    ])
  ) {
    return "medium";
  }
  if (
    containsAny(text, [
      /klein(es)? unternehmen|startup|5.?10 mitarbeiter|\d{1,2} mitarbeiter|team/,
    ])
  ) {
    return "small";
  }
  if (
    containsAny(text, [
      /selbstständig|einzelunternehmer|freiberufler|solo|alleine|ich bin der chef/,
    ])
  ) {
    return "solo";
  }
  return "unknown";
}

function analyzeIndustry(text: string): LeadSignals["industry"] {
  const industries = [
    "elektriker",
    "handwerker",
    "friseur",
    "immobilien",
    "arzt",
    "anwalt",
    "restaurant",
    "hotel",
    "fitness",
    "medtech",
    "fintech",
    "e-commerce",
    "agentur",
    "beratung",
    "logistik",
    "bau",
    "gastro",
  ];
  const matches = industries.filter((i) => text.includes(i));
  if (matches.length >= 1) return "specific";
  if (
    containsAny(text, [
      /branche|unternehmen|firma|salon|praxis|büro|betrieb|geschäft/,
    ])
  ) {
    return "mentioned";
  }
  return "unknown";
}

function analyzeServices(text: string): LeadSignals["services"] {
  const services = [
    "website",
    "webseite",
    "homepage",
    "chatbot",
    "ki",
    "automatisierung",
    "seo",
    "online.?shop",
    "e-commerce",
    "terminbuchung",
    "landingpage",
    "redesign",
    "app",
    "crm",
  ];
  const matches = services.filter((s) => new RegExp(s, "i").test(text));
  if (matches.length >= 2) return "multiple";
  if (matches.length === 1) return "specific";
  if (
    containsAny(text, [
      /digitale präsenz|online präsenz|online sichtbar|mehr kunden|online gehen/,
    ])
  ) {
    return "vague";
  }
  return "none";
}

function analyzeTimeframe(text: string): LeadSignals["timeframe"] {
  if (
    containsAny(text, [
      /sofort|dringend|asap|schnellstmöglich|diese woche|nächste woche|eilig/,
    ])
  ) {
    return "immediate";
  }
  if (
    containsAny(text, [
      /\d+\s*wochen|in einem monat|nächsten monat|bald|zeitnah|4.?6 wochen/,
    ])
  ) {
    return "weeks";
  }
  if (
    containsAny(text, [
      /in \d+ monat|nächstes quartal|dieses jahr|mittelfristig/,
    ])
  ) {
    return "months";
  }
  if (
    containsAny(text, [
      /nur informieren|erst mal|schauen|überlegen|in zukunft|noch unsicher/,
    ])
  ) {
    return "exploring";
  }
  return "unknown";
}

function analyzePurchaseInterest(text: string): LeadSignals["purchaseInterest"] {
  if (
    containsAny(text, [
      /termin buchen|erstgespräch|beratungstermin|loslegen|beauftragen|starten wir|verbindlich|angebot anfordern/,
    ])
  ) {
    return "ready";
  }
  if (
    containsAny(text, [
      /vergleichen|optionen|empfehlung|welches paket|was würden sie|interessiert mich| ernsthaft/,
    ])
  ) {
    return "evaluating";
  }
  if (
    containsAny(text, [
      /interessiert|würde gerne|überlege|informieren|möchte wissen|frage mich/,
    ])
  ) {
    return "curious";
  }
  return "browsing";
}

function analyzeUrgency(text: string): LeadSignals["urgency"] {
  if (
    containsAny(text, [
      /dringend|sofort|asap|eilig|schnellstmöglich|notfall|deadline/,
    ])
  ) {
    return "high";
  }
  if (
    containsAny(text, [
      /bald|zeitnah|nächste woche|nächsten monat|wichtig/,
    ])
  ) {
    return "medium";
  }
  if (containsAny(text, [/irgendwann|später|kein stress|flexibel/])) {
    return "low";
  }
  return "none";
}

function analyzeResponseBehavior(
  messages: ScoringMessage[]
): LeadSignals["responseBehavior"] {
  const userMessages = USER_MESSAGES(messages);
  const messageCount = userMessages.length;
  const avgMessageLength =
    messageCount > 0
      ? userMessages.reduce((sum, m) => sum + m.content.length, 0) /
        messageCount
      : 0;

  const text = joinUserText(messages);

  const answersQuestions = containsAny(text, [
    /ja,|nein,|genau|richtig|habe (schon|bereits|noch)|wir sind|ich bin|wir haben|ich habe/,
  ]);

  const asksFollowUps = containsAny(text, [
    /\?|wie funktioniert|was bedeutet|könnten sie|gibt es|was passiert/,
  ]);

  return {
    messageCount,
    avgMessageLength,
    answersQuestions,
    asksFollowUps,
  };
}

/**
 * Analysiert den Gesprächsverlauf und extrahiert alle Lead-Signale.
 */
export function analyzeLeadSignals(messages: ScoringMessage[]): LeadSignals {
  const text = joinUserText(messages);

  return {
    budget: analyzeBudget(text),
    companySize: analyzeCompanySize(text),
    industry: analyzeIndustry(text),
    services: analyzeServices(text),
    timeframe: analyzeTimeframe(text),
    purchaseInterest: analyzePurchaseInterest(text),
    urgency: analyzeUrgency(text),
    responseBehavior: analyzeResponseBehavior(messages),
  };
}
