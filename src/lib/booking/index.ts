/**
 * Terminbuchung – Öffentliche API
 */

export {
  BOOKING_TIMEZONE,
  BOOKING_SLOT_DURATION_MINUTES,
  BOOKING_MIN_ADVANCE_HOURS,
  BOOKING_MAX_ADVANCE_DAYS,
  BOOKING_WEEKDAY_SLOTS,
  BOOKING_BLOCKED_DATES,
  BOOKING_CALENDAR_PROVIDER,
  CRM_APPOINTMENTS_TABLE,
} from "./config";

export type {
  AppointmentStatus,
  CalendarProviderId,
  CrmAppointment,
  CreateAppointmentInput,
  CreateBookingResult,
  CalendarSyncResult,
} from "./types";

export {
  getAvailableSlots,
  isSlotAvailable,
  isValidBookingDate,
  getBookingDateBounds,
  getConfiguredSlotsForDate,
} from "./availability";

export {
  buildBookingConfirmationEmail,
  buildBookingConfirmationPlaceholders,
  formatBookingDateGerman,
} from "./confirmation-email";

export type { CalendarProvider } from "./calendar/providers";
export {
  InternalCalendarProvider,
  GoogleCalendarProvider,
  OutlookCalendarProvider,
  resolveCalendarProvider,
} from "./calendar/providers";
