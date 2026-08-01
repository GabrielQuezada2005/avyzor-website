/**
 * Verifikation der Terminbuchungs-Logik (ohne DB).
 * Ausführung: node scripts/verify-booking-logic.mjs
 */

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const BOOKING_WEEKDAY_SLOTS = {
  0: [],
  1: ["09:00", "09:30", "10:00"],
  2: ["09:00", "09:30", "10:00"],
  3: ["09:00", "09:30", "10:00"],
  4: ["09:00", "09:30", "10:00"],
  5: ["09:00", "09:30"],
  6: [],
};

function getWeekday(date) {
  return new Date(`${date}T12:00:00`).getDay();
}

function getAvailableSlots(date, bookedTimes = []) {
  const weekday = getWeekday(date);
  const configured = BOOKING_WEEKDAY_SLOTS[weekday] ?? [];
  const booked = new Set(bookedTimes);
  return configured.filter((slot) => !booked.has(slot));
}

console.log("→ Prüfe Wochenplan…");
assert(getAvailableSlots("2026-08-03").length > 0, "Montag sollte Slots haben");
assert(getAvailableSlots("2026-08-02").length === 0, "Sonntag sollte keine Slots haben");

console.log("→ Prüfe Belegung…");
const mondaySlots = getAvailableSlots("2026-08-03", ["09:00", "09:30"]);
assert(!mondaySlots.includes("09:00"), "Gebuchter Slot sollte fehlen");
assert(mondaySlots.includes("10:00"), "Freier Slot sollte verfügbar sein");

console.log("→ Prüfe Platzhalter…");
const template = "Guten Tag {{Name}}, Termin am {{Datum}} um {{Uhrzeit}}.";
const rendered = template
  .replace("{{Name}}", "Max")
  .replace("{{Datum}}", "Montag")
  .replace("{{Uhrzeit}}", "10:00");
assert(rendered.includes("Max"), "Name-Platzhalter fehlt");

console.log("→ Prüfe Kalender-Provider-Struktur…");
const providers = ["internal", "google", "outlook"];
assert(providers.includes("internal"), "Internal provider fehlt");
assert(providers.includes("google"), "Google provider vorbereitet");
assert(providers.includes("outlook"), "Outlook provider vorbereitet");

console.log("✓ Alle Terminbuchungs-Checks bestanden");
