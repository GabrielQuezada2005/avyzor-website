import "server-only";

import { getCrmQuoteByLeadId } from "@/lib/crm/quotes/repository.server";
import type { CrmQuoteStatus } from "@/lib/crm/quotes/types";
import { CRM_QUOTES_TABLE } from "@/lib/crm/quotes/constants";
import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";

export async function updateCrmQuoteStatus(
  quoteId: string,
  status: CrmQuoteStatus
): Promise<void> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return;

  await supabaseAdmin
    .from(CRM_QUOTES_TABLE)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId);
}

export async function getQuoteForLeadPayment(leadId: string) {
  return getCrmQuoteByLeadId(leadId);
}
