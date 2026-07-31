/**
 * Branchenerkennung – Interner Speicher
 */

import type {
  IndustryRecognitionRecord,
  IndustryRecognitionResult,
} from "./types";

export interface IndustryPersistenceAdapter {
  save(record: IndustryRecognitionRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<IndustryRecognitionRecord | null>;
}

const sessionStore = new Map<string, IndustryRecognitionRecord>();
let persistenceAdapter: IndustryPersistenceAdapter | null = null;

export function registerIndustryPersistence(
  adapter: IndustryPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function saveIndustryRecognition(
  result: IndustryRecognitionResult
): IndustryRecognitionRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: IndustryRecognitionRecord = {
    ...result,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[industry-recognition] Persistence error:", err);
    });
  }

  return record;
}

export function getIndustryRecognition(
  sessionId: string
): IndustryRecognitionRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listIndustryRecognitions(
  limit = 100
): IndustryRecognitionRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}
