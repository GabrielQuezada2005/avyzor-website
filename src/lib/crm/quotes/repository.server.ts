import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import { CRM_QUOTES_TABLE } from "./constants";
import type { CrmQuote, CrmQuoteDraft, CrmQuoteRow } from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

function mapCrmQuoteRow(row: CrmQuoteRow): CrmQuote {
  return {
    id: row.id,
    leadId: row.lead_id,
    quoteNumber: row.quote_number,
    status: row.status as CrmQuote["status"],
    draft: row.draft,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCrmQuoteByLeadId(
  leadId: string
): Promise<CrmQuote | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_QUOTES_TABLE)
    .select("*")
    .eq("lead_id", leadId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmQuoteRow(data as CrmQuoteRow);
}

export async function upsertCrmQuote(
  leadId: string,
  quoteNumber: string,
  draft: CrmQuoteDraft
): Promise<CrmQuote> {
  assertSupabaseReady();

  const payload = {
    lead_id: leadId,
    quote_number: quoteNumber,
    status: "draft",
    draft,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin!
    .from(CRM_QUOTES_TABLE)
    .upsert(payload, { onConflict: "lead_id" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`CRM-Angebot speichern fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmQuoteRow(data as CrmQuoteRow);
}
