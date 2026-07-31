/**
 * Lead-Scoring – Interner Speicher
 *
 * In-Memory-Store für Lead-Scores während der Session.
 * Vorbereitet für spätere Persistenz (Supabase, CRM, Dashboard).
 *
 * Erweiterung: LeadScorePersistenceAdapter implementieren und registrieren.
 */

import type { LeadScoreRecord, LeadScoreResult } from "./types";

/** Adapter-Interface für zukünftige Persistenz (Supabase, CRM, etc.). */
export interface LeadScorePersistenceAdapter {
  save(record: LeadScoreRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<LeadScoreRecord | null>;
  listRecent?(limit?: number): Promise<LeadScoreRecord[]>;
}

const sessionStore = new Map<string, LeadScoreRecord>();
let persistenceAdapter: LeadScorePersistenceAdapter | null = null;

/**
 * Registriert einen Persistenz-Adapter (z. B. Supabase).
 * Wird asynchron im Hintergrund aufgerufen – blockiert nicht die Antwort.
 */
export function registerLeadScorePersistence(
  adapter: LeadScorePersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

/** Speichert oder aktualisiert den Lead-Score für eine Session. */
export function saveLeadScore(result: LeadScoreResult): LeadScoreRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: LeadScoreRecord = {
    ...result,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[lead-scoring] Persistence error:", err);
    });
  }

  return record;
}

/** Liest den gespeicherten Lead-Score einer Session (intern). */
export function getLeadScore(sessionId: string): LeadScoreRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

/** Listet alle gespeicherten Lead-Scores (intern, für Dashboard/CRM). */
export function listLeadScores(limit = 100): LeadScoreRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}

/** Anzahl aktiver Sessions im Store. */
export function getLeadScoreCount(): number {
  return sessionStore.size;
}
