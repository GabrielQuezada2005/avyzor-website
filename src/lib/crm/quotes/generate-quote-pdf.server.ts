import "server-only";

import PDFDocument from "pdfkit";
import { SITE_CONFIG } from "@/lib/constants";
import { formatEuro } from "./match-service";
import type { CrmQuote } from "./types";

type PdfDocument = InstanceType<typeof PDFDocument>;

function displayValue(value: string | null | undefined): string {
  return value?.trim() || "—";
}

function formatGermanDate(isoDate: string): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(
    new Date(isoDate)
  );
}

function renderQuoteContent(
  doc: PdfDocument,
  quote: CrmQuote
): void {
  const { draft } = quote;
  const margin = 50;
  const contentWidth = doc.page.width - margin * 2;

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#C9A227")
    .text(SITE_CONFIG.name, margin, margin);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#666666")
    .text("Premium KI-Agentur", margin, doc.y + 4);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111111")
    .text("Angebot", margin, doc.y + 28);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#444444")
    .text(`Angebotsnummer: ${quote.quoteNumber}`, margin, doc.y + 8)
    .text(`Erstellt am: ${formatGermanDate(quote.createdAt.slice(0, 10))}`, margin)
    .text(`Gültig bis: ${formatGermanDate(draft.validUntil)}`, margin);

  doc.moveDown(1.5);

  sectionHeading(doc, "Kundendaten", margin);
  renderKeyValue(doc, "Name", displayValue(draft.customer.name), margin, contentWidth);
  renderKeyValue(doc, "Firma", displayValue(draft.customer.company), margin, contentWidth);
  renderKeyValue(doc, "E-Mail", displayValue(draft.customer.email), margin, contentWidth);
  renderKeyValue(doc, "Telefon", displayValue(draft.customer.phone), margin, contentWidth);

  doc.moveDown(0.8);
  sectionHeading(doc, "Gewünschte Dienstleistung", margin);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111111")
    .text(draft.serviceTitle, margin, doc.y + 4, { width: contentWidth });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333333")
    .text(draft.serviceDescription, margin, doc.y + 8, {
      width: contentWidth,
      align: "left",
    });

  doc.moveDown(0.8);
  sectionHeading(doc, "Leistungsbeschreibung", margin);

  for (const item of draft.lineItems) {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111111")
      .text(`• ${item.label}`, margin, doc.y + 4, { width: contentWidth });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(item.description, margin + 12, doc.y + 2, { width: contentWidth - 12 });

    if (item.amount > 0) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#C9A227")
        .text(formatEuro(item.amount), margin + 12, doc.y + 2);
    }
  }

  doc.moveDown(0.8);
  sectionHeading(doc, "Preis", margin);
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("#C9A227")
    .text(formatEuro(draft.priceAmount), margin, doc.y + 6);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#666666")
    .text("zzgl. gesetzlicher MwSt., unverbindlicher Beispielpreis", margin, doc.y + 4);

  doc.moveDown(0.8);
  sectionHeading(doc, "Lieferzeit", margin);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333333")
    .text(draft.deliveryTime, margin, doc.y + 4, { width: contentWidth });

  doc.moveDown(0.8);
  sectionHeading(doc, "Gültigkeitsdauer", margin);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#333333")
    .text(
      `${draft.validityDays} Tage (bis ${formatGermanDate(draft.validUntil)})`,
      margin,
      doc.y + 4,
      { width: contentWidth }
    );

  if (draft.notes) {
    doc.moveDown(0.8);
    sectionHeading(doc, "Hinweise", margin);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(draft.notes, margin, doc.y + 4, { width: contentWidth });
  }

  const footerY = doc.page.height - 60;
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#888888")
    .text(
      `${SITE_CONFIG.legal.name} · ${SITE_CONFIG.email} · ${SITE_CONFIG.phone}`,
      margin,
      footerY,
      { width: contentWidth, align: "center" }
    );
}

function sectionHeading(
  doc: PdfDocument,
  title: string,
  margin: number
): void {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#C9A227")
    .text(title.toUpperCase(), margin, doc.y + 6);
}

function renderKeyValue(
  doc: PdfDocument,
  label: string,
  value: string,
  margin: number,
  width: number
): void {
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#666666")
    .text(`${label}:`, margin, doc.y + 4, { continued: true, width })
    .font("Helvetica")
    .fillColor("#222222")
    .text(` ${value}`);
}

/** Erzeugt ein PDF-Buffer aus einem gespeicherten Angebotsentwurf. */
export async function generateQuotePdf(quote: CrmQuote): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    renderQuoteContent(doc, quote);
    doc.end();
  });
}
