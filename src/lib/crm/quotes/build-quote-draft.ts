/**
 * CRM-Angebote – Entwurf aus Lead-Daten erstellen
 */

import { SITE_CONFIG } from "@/lib/constants";
import type { CrmLead } from "../types";
import {
  DEFAULT_QUOTE_DELIVERY,
  QUOTE_DELIVERY_BY_PACKAGE,
  QUOTE_VALIDITY_DAYS,
} from "./constants";
import { formatEuro, matchServicePackage } from "./match-service";
import type { CrmQuoteDraft, CrmQuoteLineItem } from "./types";

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildLineItems(
  pkg: ReturnType<typeof matchServicePackage>
): CrmQuoteLineItem[] {
  const baseItem: CrmQuoteLineItem = {
    label: pkg.name,
    description: pkg.description,
    amount: pkg.price,
  };

  const featureItems = pkg.features.slice(0, 4).map((feature) => ({
    label: feature,
    description: "Im Leistungsumfang enthalten",
    amount: 0,
  }));

  return [baseItem, ...featureItems];
}

function resolveDeliveryTime(
  lead: CrmLead,
  packageId: string
): string {
  if (lead.timeline?.trim()) {
    return `${lead.timeline.trim()} (laut Kundenangabe)`;
  }

  return QUOTE_DELIVERY_BY_PACKAGE[packageId] ?? DEFAULT_QUOTE_DELIVERY;
}

function buildServiceDescription(
  lead: CrmLead,
  pkg: ReturnType<typeof matchServicePackage>
): string {
  const requested = lead.service?.trim();
  const detected =
    lead.detectedServices.length > 0
      ? lead.detectedServices.join(", ")
      : null;

  const parts = [
    requested
      ? `Anfrage: ${requested}.`
      : detected
        ? `Erkannte Leistungsinteressen: ${detected}.`
        : null,
    pkg.description,
    `Beispielangebot basierend auf dem ${pkg.name}-Paket von ${SITE_CONFIG.name}.`,
    "Alle Preise verstehen sich als unverbindliche Richtwerte und können nach Detailabstimmung angepasst werden.",
  ].filter(Boolean);

  return parts.join(" ");
}

/** Erstellt einen strukturierten Angebotsentwurf aus CRM-Lead-Daten. */
export function buildQuoteDraft(lead: CrmLead): CrmQuoteDraft {
  const matched = matchServicePackage({
    service: lead.service,
    detectedServices: lead.detectedServices,
    budget: lead.budget,
  });

  const validUntil = addDays(new Date(), QUOTE_VALIDITY_DAYS);
  const lineItems = buildLineItems(matched);

  return {
    customer: {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
    },
    serviceTitle: lead.service?.trim() || matched.name,
    serviceDescription: buildServiceDescription(lead, matched),
    lineItems,
    priceAmount: matched.price,
    priceCurrency: "EUR",
    deliveryTime: resolveDeliveryTime(lead, matched.id),
    validityDays: QUOTE_VALIDITY_DAYS,
    validUntil: validUntil.toISOString().slice(0, 10),
    notes: lead.budget?.trim()
      ? `Budget-Hinweis des Kunden: ${lead.budget.trim()}. Preis: ${formatEuro(matched.price)} (Beispiel).`
      : `Beispielpreis gemäß ${matched.name}-Paket: ${formatEuro(matched.price)}.`,
  };
}

export function createQuoteNumber(leadId: string): string {
  const year = new Date().getFullYear();
  const suffix = leadId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `AVY-${year}-${suffix}`;
}
