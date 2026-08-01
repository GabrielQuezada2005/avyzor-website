import { describe, expect, it } from "vitest";
import {
  getAvailableSlots,
  getBookingDateBounds,
  getConfiguredSlotsForDate,
  isSlotAvailable,
  isValidBookingDate,
} from "@/lib/booking/availability";
import { getFutureBookableDate } from "../helpers/booking-dates";

describe("Terminbuchung – Verfügbarkeit", () => {
  it("lehnt ungültige Datumsformate ab", () => {
    expect(isValidBookingDate("15.09.2026")).toBe(false);
    expect(isValidBookingDate("invalid")).toBe(false);
  });

  it("liefert Slots für gültige Wochentage", () => {
    const date = getFutureBookableDate();
    const slots = getConfiguredSlotsForDate(date);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toMatch(/^\d{2}:\d{2}$/);
  });

  it("filtert bereits gebuchte Zeiten", () => {
    const date = getFutureBookableDate();
    const slots = getConfiguredSlotsForDate(date);
    const booked = [slots[0]];
    const available = getAvailableSlots(date, booked);

    expect(available).not.toContain(slots[0]);
    expect(isSlotAvailable(date, slots[0], booked)).toBe(false);
    expect(isSlotAvailable(date, available[0], booked)).toBe(true);
  });

  it("liefert konsistente Buchungsgrenzen", () => {
    const bounds = getBookingDateBounds();
    expect(bounds.minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(bounds.maxDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(bounds.minDate <= bounds.maxDate).toBe(true);
  });
});
