/**
 * Branchenerkennung – Öffentliche API
 *
 * Pipeline: Branche erkennen → Prompt erzeugen → intern speichern
 */

import { buildIndustryPrompt } from "./prompt";
import { recognizeIndustry } from "./recognizer";
import { saveIndustryRecognition } from "./store";
import type {
  IndustryRecognitionInput,
  IndustryRecognitionPipelineResult,
} from "./types";

export type {
  IndustryDefinition,
  IndustryDetectionStatus,
  IndustryId,
  IndustryMatch,
  IndustryRecognitionInput,
  IndustryRecognitionPipelineResult,
  IndustryRecognitionRecord,
  IndustryRecognitionResult,
  RecommendationCategory,
} from "./types";

export type { IndustryPersistenceAdapter } from "./store";

export {
  INDUSTRY_CATALOG,
  INDUSTRY_BY_ID,
  INDUSTRY_LABELS,
  mapIndustryToRecommendationCategory,
} from "./catalog/industries";

export {
  detectRecommendationCategoryFromMessages,
  getIndustryDefinition,
  recognizeIndustry,
} from "./recognizer";

export { buildIndustryPrompt } from "./prompt";

export {
  getIndustryRecognition,
  listIndustryRecognitions,
  registerIndustryPersistence,
  saveIndustryRecognition,
} from "./store";

/**
 * Führt die Branchenerkennungs-Pipeline aus.
 * Ergebnis und Prompt sind intern – der Nutzer sieht sie nie direkt.
 */
export function processIndustryRecognition(
  input: IndustryRecognitionInput
): IndustryRecognitionPipelineResult {
  const { sessionId, messages } = input;

  const result = recognizeIndustry(sessionId, messages);
  const record = saveIndustryRecognition(result);
  const industryPrompt = buildIndustryPrompt(result);

  return { result, record, industryPrompt };
}
