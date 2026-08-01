/**
 * Lead-Erkennung – Temporärer In-Memory-Speicher
 *
 * Keine Datenbank – Daten gelten nur für die laufende Server-Session.
 * Vorbereitet für spätere Persistenz via Adapter.
 */

import type { LeadDetectionRecord, LeadDetectionResult } from "./types";

export interface LeadDetectionPersistenceAdapter {
  save(record: LeadDetectionRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<LeadDetectionRecord | null>;
}

const sessionStore = new Map<string, LeadDetectionRecord>();
let persistenceAdapter: LeadDetectionPersistenceAdapter | null = null;

export function registerLeadDetectionPersistence(
  adapter: LeadDetectionPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function saveLeadDetection(
  result: LeadDetectionResult
): LeadDetectionRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: LeadDetectionRecord = {
    ...result,
    createdAt: existing?.createdAt ?? result.createdAt,
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[lead-detection] Persistence error:", err);
    });
  }

  return record;
}

export function getLeadDetection(
  sessionId: string
): LeadDetectionRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listLeadDetections(limit = 100): LeadDetectionRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}

export function getLeadDetectionCount(): number {
  return sessionStore.size;
}
