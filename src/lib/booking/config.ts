/**
 * Terminbuchung – Zentrale Verfügbarkeits-Konfiguration
 *
 * Alle buchbaren Zeiten werden hier definiert.
 * Anpassungen an Öffnungszeiten, Slots und Sperrtage nur an dieser Stelle.
 */

export const BOOKING_TIMEZONE = "Europe/Berlin";

export const BOOKING_SLOT_DURATION_MINUTES = 30;

/** Mindest-Vorlauf in Stunden (z. B. 24 = ab morgen). */
export const BOOKING_MIN_ADVANCE_HOURS = 24;

/** Maximaler Buchungshorizont in Tagen. */
export const BOOKING_MAX_ADVANCE_DAYS = 60;

/** Wochentage: 0 = Sonntag, 1 = Montag, … */
export const BOOKING_WEEKDAY_SLOTS: Record<number, readonly string[]> = {
  0: [],
  1: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  2: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  3: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  4: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  5: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"],
  6: [],
};

/** Einzelne gesperrte Tage (ISO: YYYY-MM-DD). */
export const BOOKING_BLOCKED_DATES: readonly string[] = [];

/** Standard-Kalender-Anbieter (später: google | outlook). */
export const BOOKING_CALENDAR_PROVIDER = "internal" as const;

export const CRM_APPOINTMENTS_TABLE = "crm_appointments";
