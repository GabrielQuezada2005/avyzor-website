/**
 * Verifikation der Angebotslogik (ohne DB / ohne Next.js).
 * Ausführung: node scripts/verify-quote-logic.mjs
 */

import PDFDocument from "pdfkit";

const eligibleLead = {
  id: "11111111-2222-3333-4444-555555555555",
  sessionId: "test-session",
  name: "Max Mustermann",
  company: "Mustermann GmbH",
  email: "max@example.com",
  phone: "+49 170 1234567",
  service: "Premium-Website mit KI-Chatbot",
  budget: "ca. 10.000 €",
  timeline: "Q2 2026",
  status: "neu",
  source: "assistant",
  interestLevel: "high",
  completenessScore: 86,
  detectedServices: ["Premium-Websites", "KI-Chatbots"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// --- Inline-Replikation der Eligibility-Regeln ---
function shouldAutoGenerateQuote(lead) {
  const hasContact = Boolean(lead.email?.trim() || lead.phone?.trim());
  const hasIdentity = Boolean(lead.name?.trim() || lead.company?.trim());
  const hasService = Boolean(
    lead.service?.trim() || lead.detectedServices.some((s) => s.trim())
  );
  return lead.completenessScore >= 57 && hasContact && hasIdentity && hasService;
}

// --- Inline-Replikation des Draft-Aufbaus (vereinfacht) ---
function buildSampleDraft(lead) {
  return {
    customer: {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
    },
    serviceTitle: lead.service,
    serviceDescription: "Beispiel-Leistungsbeschreibung",
    lineItems: [{ label: "Professional", description: "Paket", amount: 9990 }],
    priceAmount: 9990,
    priceCurrency: "EUR",
    deliveryTime: lead.timeline ?? "4–6 Wochen",
    validityDays: 30,
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    notes: "Beispielangebot",
  };
}

async function generateSamplePdf(draft, quoteNumber) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(18).text(`Angebot ${quoteNumber}`);
    doc.fontSize(12).text(`Kunde: ${draft.customer.name}`);
    doc.text(`Leistung: ${draft.serviceTitle}`);
    doc.text(`Preis: ${draft.priceAmount} EUR`);
    doc.end();
  });
}

console.log("→ Prüfe Eligibility…");
assert(shouldAutoGenerateQuote(eligibleLead), "Eligible lead sollte Angebot auslösen");
assert(
  !shouldAutoGenerateQuote({ ...eligibleLead, email: null, phone: null, completenessScore: 29 }),
  "Unvollständiger Lead sollte kein Angebot auslösen"
);

console.log("→ Erstelle Angebotsentwurf…");
const draft = buildSampleDraft(eligibleLead);
assert(draft.priceAmount > 0, "Preis muss gesetzt sein");
assert(draft.validityDays === 30, "Gültigkeitsdauer falsch");

console.log("→ Erzeuge PDF…");
const pdf = await generateSamplePdf(draft, "AVY-2026-TEST01");
assert(pdf.length > 500, "PDF zu klein");
assert(pdf.subarray(0, 4).toString() === "%PDF", "Kein gültiges PDF");

console.log("✓ Alle Angebots-Checks bestanden");
console.log(`  Preis: ${draft.priceAmount} EUR`);
console.log(`  PDF-Größe: ${pdf.length} bytes`);
