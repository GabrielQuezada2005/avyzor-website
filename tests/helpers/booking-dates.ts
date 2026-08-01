import { BOOKING_MAX_ADVANCE_DAYS, BOOKING_MIN_ADVANCE_HOURS } from "@/lib/booking/config";

/** Liefert ein buchbares Datum (Wochentag mit Slots, außerhalb Mindest-Vorlauf). */
export function getFutureBookableDate(): string {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() + Math.ceil(BOOKING_MIN_ADVANCE_HOURS / 24) + 1);

  for (let offset = 0; offset <= BOOKING_MAX_ADVANCE_DAYS; offset += 1) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + offset);
    const weekday = candidate.getDay();
    if (weekday >= 1 && weekday <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }

  throw new Error("Kein buchbares Datum im konfigurierten Horizont gefunden.");
}
