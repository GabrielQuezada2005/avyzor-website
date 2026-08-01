/**
 * Terminbuchung – Verfügbarkeitsberechnung
 */

import {
  BOOKING_BLOCKED_DATES,
  BOOKING_MAX_ADVANCE_DAYS,
  BOOKING_MIN_ADVANCE_HOURS,
  BOOKING_TIMEZONE,
  BOOKING_WEEKDAY_SLOTS,
} from "./config";

function parseIsoDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getWeekdayInTimezone(date: string): number {
  const parsed = parseIsoDate(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "short",
  });
  const weekday = formatter.format(parsed);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? parsed.getUTCDay();
}

function getNowInTimezone(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: BOOKING_TIMEZONE })
  );
}

export function isValidBookingDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (BOOKING_BLOCKED_DATES.includes(date)) return false;

  const target = parseIsoDate(date);
  const now = getNowInTimezone();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + Math.ceil(BOOKING_MIN_ADVANCE_HOURS / 24));
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_MAX_ADVANCE_DAYS);

  const targetLocal = new Date(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate()
  );

  return targetLocal >= minDate && targetLocal <= maxDate;
}

export function getConfiguredSlotsForDate(date: string): string[] {
  if (!isValidBookingDate(date)) return [];

  const weekday = getWeekdayInTimezone(date);
  return [...(BOOKING_WEEKDAY_SLOTS[weekday] ?? [])];
}

export function filterPastSlotsForToday(
  date: string,
  slots: string[]
): string[] {
  const now = getNowInTimezone();
  const todayIso = formatIsoDate(
    new Date(now.getFullYear(), now.getMonth(), now.getDate())
  );

  if (date !== todayIso) return slots;

  const minTotalMinutes = now.getHours() * 60 + now.getMinutes() + BOOKING_MIN_ADVANCE_HOURS * 60;

  return slots.filter((slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    return hours * 60 + minutes >= minTotalMinutes;
  });
}

export function getAvailableSlots(
  date: string,
  bookedTimes: string[] = []
): string[] {
  const configured = getConfiguredSlotsForDate(date);
  const booked = new Set(bookedTimes);
  const filtered = filterPastSlotsForToday(date, configured);
  return filtered.filter((slot) => !booked.has(slot));
}

export function isSlotAvailable(
  date: string,
  time: string,
  bookedTimes: string[] = []
): boolean {
  return getAvailableSlots(date, bookedTimes).includes(time);
}

export function getBookingDateBounds(): { minDate: string; maxDate: string } {
  const now = getNowInTimezone();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  min.setDate(min.getDate() + Math.ceil(BOOKING_MIN_ADVANCE_HOURS / 24));
  const max = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  max.setDate(max.getDate() + BOOKING_MAX_ADVANCE_DAYS);

  return {
    minDate: formatIsoDate(min),
    maxDate: formatIsoDate(max),
  };
}
