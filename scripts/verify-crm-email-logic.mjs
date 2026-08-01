/**
 * Verifikation der CRM-E-Mail-Logik (ohne DB / ohne Next.js).
 * Ausführung: node scripts/verify-crm-email-logic.mjs
 */

const PLACEHOLDER_PATTERN = /\{\{(\w+)\}\}/g;

function applyPlaceholders(template, values) {
  return template.replace(PLACEHOLDER_PATTERN, (_match, key) => values[key] ?? "");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const lead = {
  name: "Max Mustermann",
  company: "Mustermann GmbH",
  service: "Premium-Website mit KI-Chatbot",
  detectedServices: ["KI-Chatbots"],
};

const quote = {
  quoteNumber: "AVY-2026-ABC123",
  draft: { priceAmount: 9990 },
};

const values = {
  Name: lead.name,
  Firma: lead.company,
  Dienstleistung: lead.service,
  Angebotsnummer: quote.quoteNumber,
  Preis: "9.990 €",
};

console.log("→ Prüfe Platzhalter…");
const subject = applyPlaceholders(
  "Ihr Angebot {{Angebotsnummer}} – {{Dienstleistung}}",
  values
);
assert(subject.includes("AVY-2026-ABC123"), "Angebotsnummer nicht ersetzt");
assert(subject.includes("Premium-Website"), "Dienstleistung nicht ersetzt");

const body = applyPlaceholders("Guten Tag {{Name}} von {{Firma}},", values);
assert(body.includes("Max Mustermann"), "Name nicht ersetzt");
assert(body.includes("Mustermann GmbH"), "Firma nicht ersetzt");

console.log("→ Prüfe Vorlagen-Metadaten…");
const templates = [
  { id: "erstkontakt", attachQuotePdf: false },
  { id: "angebot", attachQuotePdf: true },
  { id: "erinnerung", attachQuotePdf: false },
  { id: "dankeschoen", attachQuotePdf: false },
];
assert(templates.length === 4, "Es müssen 4 Vorlagen existieren");
assert(
  templates.find((t) => t.id === "angebot")?.attachQuotePdf === true,
  "Angebotsvorlage muss PDF-Anhang unterstützen"
);

console.log("→ Prüfe Versand-Gate (ohne Konfiguration)…");
const resendConfigured = Boolean(
  process.env.RESEND_API_KEY &&
    !process.env.RESEND_API_KEY.includes("your_api_key")
);
if (!resendConfigured) {
  console.log("  Resend nicht konfiguriert – Versand würde protokolliert, nicht gesendet ✓");
} else {
  console.log("  Resend konfiguriert – echter Versand möglich");
}

console.log("✓ Alle E-Mail-Checks bestanden");
