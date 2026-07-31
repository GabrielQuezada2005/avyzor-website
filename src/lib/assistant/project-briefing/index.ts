/**
 * Projektbriefing – Öffentliche API
 *
 * Pipeline: Extrahieren → Briefing bauen → Confidence → Prompt → Speichern
 */

import { buildBriefingDocument } from "./briefing-builder";
import { calculateConfidence } from "./confidence";
import { extractBriefingFields, mapFieldsToBriefing } from "./extractor";
import { buildBriefingPrompt } from "./prompt";
import { saveProjectBriefing } from "./store";
import type {
  ProjectBriefing,
  ProjectBriefingInput,
  ProjectBriefingPipelineResult,
  ProjectBriefingRecord,
} from "./types";

export type {
  BriefingDocument,
  BriefingExportSection,
  BriefingFieldDefinition,
  BriefingFieldValue,
  BriefingCategory,
  ClientSection,
  CommercialSection,
  ConfidenceResult,
  ContextSection,
  ProjectBriefing,
  ProjectBriefingInput,
  ProjectBriefingPipelineResult,
  ProjectBriefingRecord,
  ProjectSection,
  RequirementsSection,
} from "./types";

export type { BriefingPersistenceAdapter } from "./store";

export { BRIEFING_FIELD_CATALOG, BRIEFING_FIELD_BY_ID } from "./fields/catalog";
export { extractBriefingFields, mapFieldsToBriefing } from "./extractor";
export {
  calculateConfidence,
  getMissingFieldsByPriority,
  getTopMissingFields,
} from "./confidence";
export { buildBriefingDocument } from "./briefing-builder";
export { buildBriefingPrompt } from "./prompt";
export {
  getBriefingDocument,
  getProjectBriefing,
  listProjectBriefings,
  registerBriefingPersistence,
  saveProjectBriefing,
} from "./store";

/**
 * Führt die Projektbriefing-Pipeline aus.
 * Briefing und Confidence Score sind intern – der Kunde sieht sie standardmäßig nicht.
 */
export function processProjectBriefing(
  input: ProjectBriefingInput
): ProjectBriefingPipelineResult {
  const { sessionId, messages } = input;

  const fields = extractBriefingFields(messages);
  const mapped = mapFieldsToBriefing(fields);
  const confidence = calculateConfidence(fields);

  const result: ProjectBriefing = {
    sessionId,
    ...mapped,
    confidenceScore: confidence.score,
    missingFields: confidence.missingLabels,
    messageCount: messages.filter((m) => m.role === "user").length,
    updatedAt: new Date().toISOString(),
  };

  const document = buildBriefingDocument(result);

  const record: ProjectBriefingRecord = {
    ...result,
    document,
    createdAt: new Date().toISOString(),
  };

  saveProjectBriefing(record);
  const briefingPrompt = buildBriefingPrompt(result);

  return { result, record, briefingPrompt };
}
