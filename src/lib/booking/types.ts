/**
 * Terminbuchung – Typen
 */

export type AppointmentStatus =
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type CalendarProviderId = "internal" | "google" | "outlook";

export interface CrmAppointment {
  id: string;
  leadId: string | null;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  notes: string | null;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  durationMinutes: number;
  status: AppointmentStatus;
  calendarProvider: CalendarProviderId | null;
  externalEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmAppointmentRow {
  id: string;
  lead_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  notes: string | null;
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  duration_minutes: number;
  status: string;
  calendar_provider: string | null;
  external_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentInput {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  notes?: string | null;
  date: string;
  time: string;
}

export interface BookingConfirmationPlaceholders {
  Name: string;
  Firma: string;
  Dienstleistung: string;
  Datum: string;
  Uhrzeit: string;
}

export interface CalendarEventInput {
  appointment: CrmAppointment;
  summary: string;
  description: string;
}

export interface CalendarSyncResult {
  provider: CalendarProviderId;
  externalEventId: string | null;
  synced: boolean;
  message: string;
}

export interface CreateBookingResult {
  appointment: CrmAppointment;
  leadId: string | null;
  emailSent: boolean;
  emailMessage: string;
  calendarSync: CalendarSyncResult;
}
