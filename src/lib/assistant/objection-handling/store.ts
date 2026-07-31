/**
 * Einwandbehandlung – Interner Speicher
 *
 * Vorbereitet für CRM/Dashboard-Integration.
 */

import type { ObjectionHandlingRecord, ObjectionHandlingResult } from "./types";

export interface ObjectionPersistenceAdapter {
  save(record: ObjectionHandlingRecord): Promise<void>;
  getBySessionId(sessionId: string): Promise<ObjectionHandlingRecord | null>;
}

const sessionStore = new Map<string, ObjectionHandlingRecord>();
let persistenceAdapter: ObjectionPersistenceAdapter | null = null;

export function registerObjectionPersistence(
  adapter: ObjectionPersistenceAdapter
): void {
  persistenceAdapter = adapter;
}

export function saveObjectionHandling(
  result: ObjectionHandlingResult
): ObjectionHandlingRecord {
  const existing = sessionStore.get(result.sessionId);

  const record: ObjectionHandlingRecord = {
    ...result,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  sessionStore.set(result.sessionId, record);

  if (persistenceAdapter) {
    persistenceAdapter.save(record).catch((err) => {
      console.error("[objection-handling] Persistence error:", err);
    });
  }

  return record;
}

export function getObjectionHandling(
  sessionId: string
): ObjectionHandlingRecord | null {
  return sessionStore.get(sessionId) ?? null;
}

export function listObjectionHandlings(
  limit = 100
): ObjectionHandlingRecord[] {
  return Array.from(sessionStore.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}
