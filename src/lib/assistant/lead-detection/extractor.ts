/**
 * Lead-Erkennung – Extraktion
 *
 * Heuristische Erkennung von Kontaktdaten und Projektinformationen
 * aus dem Nutzer-Gesprächsverlauf (ohne zusätzlichen API-Call).
 */

import type { ScoringMessage } from "../lead-scoring/types";
import type { DetectedLeadProfile, ServiceInterestLevel } from "./types";

const SERVICE_PATTERNS: Array<{ id: string; label: string; patterns: RegExp[] }> =
  [
    {
      id: "website",
      label: "Premium-Website",
      patterns: [/website|webseite|homepage|landing\s*page|internetauftritt/i],
    },
    {
      id: "chatbot",
      label: "KI-Chatbot",
      patterns: [/chatbot|ki.?chat|assistent|gpt/i],
    },
    {
      id: "automation",
      label: "KI-Automatisierung",
      patterns: [/automatisier|workflow|prozess.?automatis/i],
    },
    {
      id: "seo",
      label: "SEO",
      patterns: [/\bseo\b|suchmaschinen|google.? ranking|sichtbarkeit/i],
    },
    {
      id: "booking",
      label: "Terminbuchung",
      patterns: [/terminbuchung|online.?termin|kalender|buchungssystem/i],
    },
    {
      id: "crm",
      label: "CRM-Integration",
      patterns: [/\bcrm\b|hubspot|salesforce|kundendaten/i],
    },
  ];

function userMessages(messages: ScoringMessage[]): ScoringMessage[] {
  return messages.filter((m) => m.role === "user");
}

function joinUserText(messages: ScoringMessage[]): string {
  return userMessages(messages)
    .map((m) => m.content)
    .join("\n");
}

function extractFirstMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = match?.[1]?.trim();
    if (value && value.length >= 2) return value;
  }
  return null;
}

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function extractEmail(text: string): string | null {
  const match = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
  );
  return match?.[0]?.toLowerCase() ?? null;
}

export function extractPhone(text: string): string | null {
  return extractFirstMatch(text, [
    /(?:tel|telefon|handy|mobil|phone)[:\s]+([+\d\s()/\-]{8,20})/i,
    /(\+49[\d\s()/\-]{8,18})/,
    /(0\d{2,4}[\s/\-]?\d{3,10})/,
  ]);
}

export function extractName(text: string): string | null {
  return extractFirstMatch(text, [
    /(?:ich bin|mein name ist|name ist|hier ist)\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)/,
    /(?:grüß(?:e|en)\s+(?:sie\s+)?(?:gut\s+)?(?:tag|abend),?\s+)?(?:ich bin|hier)\s+([A-ZÄÖÜ][a-zäöüß]+)/,
    /(?:i'?m|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ]);
}

export function extractCompany(text: string): string | null {
  return extractFirstMatch(text, [
    /(?:firma|unternehmen|betrieb|studio|salon|praxis|agentur)\s+[„"']?([^„"'.?\n,]{2,50})/i,
    /(?:wir sind|ich bin von|bei)\s+(?:der\s+|die\s+|dem\s+)?[„"']?([^„"'.?\n,]{2,50})/i,
    /(?:company|firmenname)[:\s]+([^.\n?]{2,50})/i,
  ]);
}

export function extractBudget(text: string): string | null {
  const euroMatch = text.match(
    /\b(\d{1,2}[.,]?\d{3})\s*(?:€|euro|EUR)\b/i
  );
  if (euroMatch) return `${euroMatch[1]} €`;

  return extractFirstMatch(text, [
    /budget[:\s]+([^.\n?]{3,40})/i,
    /(?:habe|maximal|ca\.?|circa)\s+([^.\n?]{3,30})\s*(?:€|euro)/i,
  ]);
}

export function extractTimeline(text: string): string | null {
  if (/sofort|dringend|asap|schnellstmöglich|eilig/i.test(text)) {
    return "Sofort / dringend";
  }

  const explicit = extractFirstMatch(text, [
    /(?:zeitrahmen|timeline|bis|start|launch|fertig)[:\s]+([^.\n?]{3,40})/i,
    /(?:in|innerhalb von)\s+(\d+\s*(?:wochen|monat(?:en)?|tagen?))/i,
  ]);
  if (explicit) return explicit;

  if (/\d+\s*wochen/i.test(text)) {
    const match = text.match(/(\d+\s*wochen)/i);
    return match?.[1] ?? null;
  }
  if (/nächsten monat|in einem monat/i.test(text)) return "Nächster Monat";
  if (/nur informieren|erst mal|überlegen/i.test(text)) return "Noch in Planung";

  return null;
}

export function detectServices(text: string): string[] {
  const lower = text.toLowerCase();
  return SERVICE_PATTERNS.filter(({ patterns }) =>
    patterns.some((p) => p.test(lower))
  ).map(({ label }) => label);
}

export function detectServiceInterestLevel(
  text: string,
  detectedServices: string[]
): ServiceInterestLevel {
  if (
    containsAny(text, [
      /termin buchen|erstgespräch|beratungstermin|beauftragen|loslegen|angebot anfordern|verbindlich/i,
    ])
  ) {
    return "ready";
  }

  if (
    containsAny(text, [
      /interessiert|würde gerne|brauche|benötige|möchte|planen wir|wollen wir/i,
    ]) ||
    detectedServices.length > 0
  ) {
    return "interested";
  }

  if (
    containsAny(text, [
      /was kostet|preis|angebot|informieren|frage mich|optionen|empfehlung/i,
    ])
  ) {
    return "curious";
  }

  return "none";
}

export function extractDesiredService(
  text: string,
  detectedServices: string[]
): string | null {
  if (detectedServices.length > 0) return detectedServices.join(", ");

  return extractFirstMatch(text, [
    /(?:brauche|benötige|interesse an|suche|möchte)\s+(?:eine[nr]?\s+)?([^.\n?]{5,60})/i,
    /(?:projekt|vorhaben)[:\s]+([^.\n?]{5,60})/i,
  ]);
}

/**
 * Extrahiert alle Lead-Profilfelder aus dem Gesprächsverlauf.
 */
export function extractLeadProfile(
  messages: ScoringMessage[]
): DetectedLeadProfile {
  const text = joinUserText(messages);
  const detectedServices = detectServices(text);

  return {
    name: extractName(text),
    company: extractCompany(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    desiredService: extractDesiredService(text, detectedServices),
    budget: extractBudget(text),
    timeline: extractTimeline(text),
  };
}

export function calculateProfileCompleteness(
  profile: DetectedLeadProfile
): number {
  const fields = [
    profile.name,
    profile.company,
    profile.email,
    profile.phone,
    profile.desiredService,
    profile.budget,
    profile.timeline,
  ];
  const filled = fields.filter((v) => v !== null && v.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

export function hasServiceInterest(
  level: ServiceInterestLevel,
  detectedServices: string[]
): boolean {
  return level !== "none" || detectedServices.length > 0;
}

export { SERVICE_PATTERNS };
