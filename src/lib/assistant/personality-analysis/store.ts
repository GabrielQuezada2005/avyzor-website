/**
 * Persönlichkeitsanalyse – Interner Speicher
 *
 * Vorbereitet für CRM/Dashboard-Integration.
 */

import type {
  PersonalityAnalysisRecord,
  PersonalityAnalysisResult,
} from "./types";

export interface PersonalityPersistenceAdapter {
  save(record: PersonalityAnalysisRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<PersonalityAnalysisRecord | null>;
}

const sessionStore = new Map<string, PersonalityAnalysisRecord>();
let persistenceAdapter: PersonalityPersistenceAdapter | null = null;

export function registerPersonalityPersistence(
  adapter: PersonalityPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function savePersonalityAnalysis(
  result: PersonalityAnalysisResult
): PersonalityAnalysisRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: PersonalityAnalysisRecord = {
    ...result,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[personality-analysis] Persistence error:", err);
    });
  }

  return record;
}

export function getPersonalityAnalysis(
  sessionId: string
): PersonalityAnalysisRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listPersonalityAnalyses(
  limit = 100
): PersonalityAnalysisRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}
