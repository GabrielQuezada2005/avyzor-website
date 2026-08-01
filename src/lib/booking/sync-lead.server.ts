import "server-only";

import { upsertCrmLead, getCrmLeadByEmail } from "@/lib/crm/repository.server";
import type { CrmLead } from "@/lib/crm/types";
import type { CreateAppointmentInput } from "./types";

function bookingSessionId(email: string): string {
  return `booking:${email.trim().toLowerCase()}`;
}

function calculateBookingCompleteness(input: CreateAppointmentInput): number {
  const fields = [
    input.name,
    input.email,
    input.phone,
    input.service,
    input.notes,
    input.date,
    input.time,
  ];
  const filled = fields.filter((value) => value?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

/**
 * Ordnet eine Terminbuchung einem CRM-Lead zu (E-Mail als Schlüssel).
 * Legt bei Bedarf einen neuen Lead an.
 */
export async function syncBookingToCrmLead(
  input: CreateAppointmentInput
): Promise<CrmLead | null> {
  const email = input.email.trim().toLowerCase();
  const existing = await getCrmLeadByEmail(email);

  const timeline = `${input.date} ${input.time}`;

  const lead = await upsertCrmLead({
    sessionId: existing?.sessionId ?? bookingSessionId(email),
    name: input.name,
    email,
    phone: input.phone ?? existing?.phone ?? null,
    service: input.service ?? existing?.service ?? null,
    timeline: existing?.timeline ? `${existing.timeline}; Termin: ${timeline}` : timeline,
    source: "booking",
    completenessScore: Math.max(
      existing?.completenessScore ?? 0,
      calculateBookingCompleteness(input)
    ),
  });

  return lead;
}
