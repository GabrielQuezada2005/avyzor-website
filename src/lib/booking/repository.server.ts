import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import {
  BOOKING_SLOT_DURATION_MINUTES,
  BOOKING_TIMEZONE,
  CRM_APPOINTMENTS_TABLE,
} from "./config";
import type {
  CreateAppointmentInput,
  CrmAppointment,
  CrmAppointmentRow,
} from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

function normalizeTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function displayTime(time: string): string {
  return time.slice(0, 5);
}

function mapAppointmentRow(row: CrmAppointmentRow): CrmAppointment {
  return {
    id: row.id,
    leadId: row.lead_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    notes: row.notes,
    scheduledDate: row.scheduled_date,
    scheduledTime: displayTime(row.scheduled_time),
    timezone: row.timezone,
    durationMinutes: row.duration_minutes,
    status: row.status as CrmAppointment["status"],
    calendarProvider: row.calendar_provider as CrmAppointment["calendarProvider"],
    externalEventId: row.external_event_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_APPOINTMENTS_TABLE)
    .select("scheduled_time")
    .eq("scheduled_date", date)
    .eq("status", "confirmed");

  if (error || !data) return [];

  return (data as Array<{ scheduled_time: string }>).map((row) =>
    displayTime(row.scheduled_time)
  );
}

export async function createAppointment(
  input: CreateAppointmentInput,
  leadId: string | null,
  calendarProvider: string | null,
  externalEventId: string | null
): Promise<CrmAppointment> {
  assertSupabaseReady();

  const { data, error } = await supabaseAdmin!
    .from(CRM_APPOINTMENTS_TABLE)
    .insert({
      lead_id: leadId,
      name: input.name,
      email: input.email.trim().toLowerCase(),
      phone: input.phone ?? null,
      service: input.service ?? null,
      notes: input.notes ?? null,
      scheduled_date: input.date,
      scheduled_time: normalizeTime(input.time),
      timezone: BOOKING_TIMEZONE,
      duration_minutes: BOOKING_SLOT_DURATION_MINUTES,
      status: "confirmed",
      calendar_provider: calendarProvider,
      external_event_id: externalEventId,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      throw new Error("Dieser Termin ist leider bereits vergeben.");
    }
    throw new Error(`Termin speichern fehlgeschlagen: ${error?.message}`);
  }

  return mapAppointmentRow(data as CrmAppointmentRow);
}

export async function getAppointmentsByLeadId(
  leadId: string
): Promise<CrmAppointment[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_APPOINTMENTS_TABLE)
    .select("*")
    .eq("lead_id", leadId)
    .order("scheduled_date", { ascending: true });

  if (error || !data) return [];
  return (data as CrmAppointmentRow[]).map(mapAppointmentRow);
}

export async function listAllAppointments(
  limit = 100
): Promise<CrmAppointment[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_APPOINTMENTS_TABLE)
    .select("*")
    .order("scheduled_date", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return (data as CrmAppointmentRow[]).map(mapAppointmentRow);
}
