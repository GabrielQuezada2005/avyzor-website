import "server-only";

import type { LeadDetectionRecord } from "@/lib/assistant/lead-detection";
import { isSupabaseConfigured } from "@/lib/env";
import { autoGenerateQuoteForLead } from "./quotes/auto-generate.server";
import {
  mapLeadDetectionToCrmInput,
  shouldPersistCrmLead,
} from "./map-from-detection";
import { upsertCrmLead } from "./repository.server";
import type { CrmLeadSyncResult } from "./types";

/**
 * Synchronisiert ein Lead-Erkennungsergebnis dauerhaft in die CRM-Datenbank.
 * Blockiert den Chat nicht – Fehler werden geloggt, Ergebnis wird zurückgegeben.
 */
export async function syncDetectedLeadToCrm(
  record: LeadDetectionRecord
): Promise<CrmLeadSyncResult> {
  if (!isSupabaseConfigured()) {
    return { saved: false, lead: null, reason: "not_configured" };
  }

  if (!shouldPersistCrmLead(record)) {
    return { saved: false, lead: null, reason: "no_data" };
  }

  try {
    const input = mapLeadDetectionToCrmInput(record);
    const lead = await upsertCrmLead(input);

    console.info(
      `[crm] Lead gespeichert session=${record.sessionId} id=${lead.id} status=${lead.status}`
    );

    await autoGenerateQuoteForLead(lead);

    return { saved: true, lead };
  } catch (error) {
    console.error("[crm] Lead-Sync fehlgeschlagen:", error);
    return { saved: false, lead: null, reason: "error" };
  }
}
