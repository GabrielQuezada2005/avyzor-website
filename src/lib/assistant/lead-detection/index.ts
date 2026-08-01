/**
 * Lead-Erkennung – Öffentliche API
 *
 * Erkennt automatisch Lead-Informationen und Dienstleistungsinteresse
 * aus dem Chat-Gesprächsverlauf.
 */

import {
  calculateProfileCompleteness,
  detectServiceInterestLevel,
  detectServices,
  extractLeadProfile,
  hasServiceInterest,
} from "./extractor";
import { formatLeadProfileForDisplay } from "./format";
import { getLeadDetection, saveLeadDetection } from "./store";
import type {
  LeadDetectionInput,
  LeadDetectionRecord,
  LeadDetectionResult,
  LeadProfileDisplay,
} from "./types";

export type {
  DetectedLeadProfile,
  LeadDetectionInput,
  LeadDetectionRecord,
  LeadDetectionResult,
  LeadProfileDisplay,
  ServiceInterestLevel,
} from "./types";

export {
  extractLeadProfile,
  detectServices,
  detectServiceInterestLevel,
} from "./extractor";

export { formatLeadProfileForDisplay, summarizeDetectedFields } from "./format";

export {
  getLeadDetection,
  getLeadDetectionCount,
  listLeadDetections,
  registerLeadDetectionPersistence,
  saveLeadDetection,
} from "./store";

/**
 * Führt die Lead-Erkennung aus, speichert das Ergebnis temporär
 * und gibt die strukturierte Lead-Daten zurück.
 */
export function processLeadDetection(
  sessionId: string,
  messages: LeadDetectionInput["messages"]
): LeadDetectionRecord {
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const text = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  const profile = extractLeadProfile(messages);
  const detectedServices = detectServices(text);
  const serviceInterestLevel = detectServiceInterestLevel(text, detectedServices);
  const now = new Date().toISOString();
  const existing = getLeadDetection(sessionId);

  const result: LeadDetectionResult = {
    sessionId,
    profile,
    hasServiceInterest: hasServiceInterest(serviceInterestLevel, detectedServices),
    serviceInterestLevel,
    detectedServices,
    completenessScore: calculateProfileCompleteness(profile),
    messageCount: userMessageCount,
    updatedAt: now,
    createdAt: existing?.createdAt ?? now,
  };

  return saveLeadDetection(result);
}

/**
 * Liefert die lesbare Darstellung für Logs und API.
 */
export function getLeadProfileDisplay(
  sessionId: string,
  messages: LeadDetectionInput["messages"]
): LeadProfileDisplay {
  const record = processLeadDetection(sessionId, messages);
  return formatLeadProfileForDisplay(record);
}
