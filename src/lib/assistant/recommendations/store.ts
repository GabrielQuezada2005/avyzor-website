/**
 * Empfehlungssystem – Interner Speicher
 *
 * Vorbereitet für CRM/Dashboard-Integration.
 */

import type { RecommendationRecord, RecommendationResult } from "./types";

export interface RecommendationPersistenceAdapter {
  save(record: RecommendationRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<RecommendationRecord | null>;
}

const sessionStore = new Map<string, RecommendationRecord>();
let persistenceAdapter: RecommendationPersistenceAdapter | null = null;

export function registerRecommendationPersistence(
  adapter: RecommendationPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function saveRecommendation(
  result: RecommendationResult
): RecommendationRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: RecommendationRecord = {
    ...result,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[recommendations] Persistence error:", err);
    });
  }

  return record;
}

export function getRecommendation(
  sessionId: string
): RecommendationRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listRecommendations(limit = 100): RecommendationRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}
