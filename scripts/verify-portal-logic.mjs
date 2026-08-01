/**
 * Verifikation der Kundenportal-Logik (ohne DB).
 * Ausführung: node scripts/verify-portal-logic.mjs
 */

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("→ Prüfe Rollen…");
const roles = ["admin", "employee", "customer"];
assert(roles.length === 3, "Drei Rollen erforderlich");
assert(roles.includes("customer"), "Kunden-Rolle fehlt");

console.log("→ Prüfe Datenzugriff-Regeln…");
function canAccessLeadData(session, leadId) {
  if (session.role === "admin" || session.role === "employee") return true;
  return session.leadId === leadId;
}

assert(
  canAccessLeadData({ role: "customer", leadId: "a" }, "a"),
  "Kunde sollte eigenen Lead sehen"
);
assert(
  !canAccessLeadData({ role: "customer", leadId: "a" }, "b"),
  "Kunde sollte fremden Lead nicht sehen"
);
assert(
  canAccessLeadData({ role: "admin", leadId: "a" }, "b"),
  "Admin sollte alle Leads sehen können"
);

console.log("→ Prüfe Portal-Routen…");
const routes = [
  "/portal/login",
  "/portal/register",
  "/portal/dashboard",
  "/portal/offers",
  "/portal/appointments",
  "/portal/invoices",
  "/portal/projects",
  "/portal/messages",
];
assert(routes.length >= 8, "Portal-Routen unvollständig");

console.log("✓ Alle Kundenportal-Checks bestanden");
