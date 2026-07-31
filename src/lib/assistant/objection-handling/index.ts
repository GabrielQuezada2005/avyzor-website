/**
 * Einwandbehandlung – Öffentliche API
 *
 * Pipeline: Einwände erkennen → Prompt erzeugen → intern speichern
 */

import { detectObjections, selectPrimaryObjection } from "./detector";
import { buildObjectionHandlingPrompt } from "./prompt";
import { saveObjectionHandling } from "./store";
import type {
  ObjectionHandlingInput,
  ObjectionHandlingPipelineResult,
  ObjectionHandlingResult,
} from "./types";

export type {
  DetectedObjection,
  ObjectionDefinition,
  ObjectionHandlingInput,
  ObjectionHandlingPipelineResult,
  ObjectionHandlingRecord,
  ObjectionHandlingResult,
  ObjectionType,
} from "./types";

export type { ObjectionPersistenceAdapter } from "./store";

export { OBJECTION_CATALOG, OBJECTION_BY_ID } from "./catalog";
export { OBJECTION_TYPE_LABELS } from "./types";
export { detectObjections, selectPrimaryObjection } from "./detector";
export { buildObjectionHandlingPrompt } from "./prompt";
export {
  getObjectionHandling,
  listObjectionHandlings,
  registerObjectionPersistence,
  saveObjectionHandling,
} from "./store";

/**
 * Führt die Einwandbehandlungs-Pipeline aus.
 * Ergebnis und Prompt sind intern – der Nutzer sieht sie nie direkt.
 */
export function processObjectionHandling(
  input: ObjectionHandlingInput
): ObjectionHandlingPipelineResult {
  const { sessionId, messages } = input;

  const detected = detectObjections(messages);
  const primary = selectPrimaryObjection(detected);

  const result: ObjectionHandlingResult = {
    sessionId,
    detected,
    primary,
    messageCount: messages.filter((m) => m.role === "user").length,
    updatedAt: new Date().toISOString(),
  };

  const record = saveObjectionHandling(result);
  const objectionPrompt = buildObjectionHandlingPrompt(result);

  return { result, record, objectionPrompt };
}
