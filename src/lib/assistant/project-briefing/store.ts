/**
 * Projektbriefing – Interner Speicher
 *
 * Vorbereitet für CRM, PDF, Dashboard und Projektakten.
 */

import type { BriefingDocument, ProjectBriefingRecord } from "./types";

export interface BriefingPersistenceAdapter {
  save(record: ProjectBriefingRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<ProjectBriefingRecord | null>;
  exportDocument?(sessionId: string): Promise<BriefingDocument | null>;
}

const sessionStore = new Map<string, ProjectBriefingRecord>();
let persistenceAdapter: BriefingPersistenceAdapter | null = null;

export function registerBriefingPersistence(
  adapter: BriefingPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function saveProjectBriefing(
  record: ProjectBriefingRecord
): ProjectBriefingRecord {
  const existing = sessionStore.get(record.sessionId);

  const saved: ProjectBriefingRecord = {
    ...record,
    createdAt: existing?.createdAt ?? record.createdAt,
  };

  sessionStore.set(record.sessionId, saved);

  if (persistenceAdapter) {
    persistenceAdapter.save(saved).catch((err) => {
      console.error("[project-briefing] Persistence error:", err);
    });
  }

  return saved;
}

export function getProjectBriefing(
  sessionId: string
): ProjectBriefingRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listProjectBriefings(limit = 100): ProjectBriefingRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}

export function getBriefingDocument(
  sessionId: string
): BriefingDocument | null {
  return sessionStore.get(sessionId)?.document ?? null;
}
