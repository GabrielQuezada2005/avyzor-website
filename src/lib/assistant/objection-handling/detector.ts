/**
 * Einwandbehandlung – Erkennung
 *
 * Analysiert Nutzernachrichten auf typische Einwände.
 * Priorisiert die letzte Nutzernachricht.
 */

import { OBJECTION_CATALOG } from "./catalog";
import type { DetectedObjection, ObjectionDefinition } from "./types";
import type { ScoringMessage } from "../lead-scoring/types";

function getUserMessages(messages: ScoringMessage[]): ScoringMessage[] {
  return messages.filter((m) => m.role === "user");
}

function matchObjection(
  text: string,
  definition: ObjectionDefinition
): { matched: boolean; matchedText: string; confidence: number } {
  for (const pattern of definition.patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        matched: true,
        matchedText: match[0],
        confidence: Math.min(0.6 + definition.priority / 250, 0.95),
      };
    }
  }
  return { matched: false, matchedText: "", confidence: 0 };
}

/**
 * Erkennt Einwände im Gesprächsverlauf.
 * Die letzte Nutzernachricht hat höchste Priorität.
 */
export function detectObjections(
  messages: ScoringMessage[]
): DetectedObjection[] {
  const userMessages = getUserMessages(messages);
  if (userMessages.length === 0) return [];

  const lastMessage = userMessages[userMessages.length - 1].content.toLowerCase();
  const fullText = userMessages.map((m) => m.content.toLowerCase()).join("\n");

  const detected: DetectedObjection[] = [];

  for (const definition of OBJECTION_CATALOG) {
    const lastMatch = matchObjection(lastMessage, definition);
    const fullMatch = matchObjection(fullText, definition);

    if (lastMatch.matched) {
      detected.push({
        type: definition.id,
        label: definition.label,
        confidence: lastMatch.confidence + 0.1,
        matchedText: lastMatch.matchedText,
        isActive: true,
      });
    } else if (fullMatch.matched) {
      detected.push({
        type: definition.id,
        label: definition.label,
        confidence: fullMatch.confidence,
        matchedText: fullMatch.matchedText,
        isActive: false,
      });
    }
  }

  return detected.sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return b.confidence - a.confidence;
  });
}

/** Wählt den primären Einwand (aktuell relevanter). */
export function selectPrimaryObjection(
  detected: DetectedObjection[]
): DetectedObjection | null {
  const active = detected.filter((d) => d.isActive);
  if (active.length > 0) return active[0];
  return detected[0] ?? null;
}
