/**
 * CRM-Angebote – Typen
 */

export type CrmQuoteStatus = "draft" | "sent" | "accepted" | "expired";

export interface CrmQuoteCustomer {
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
}

export interface CrmQuoteLineItem {
  label: string;
  description: string;
  amount: number;
}

export interface CrmQuoteDraft {
  customer: CrmQuoteCustomer;
  serviceTitle: string;
  serviceDescription: string;
  lineItems: CrmQuoteLineItem[];
  priceAmount: number;
  priceCurrency: "EUR";
  deliveryTime: string;
  validityDays: number;
  validUntil: string;
  notes: string;
}

export interface CrmQuote {
  id: string;
  leadId: string;
  quoteNumber: string;
  status: CrmQuoteStatus;
  draft: CrmQuoteDraft;
  createdAt: string;
  updatedAt: string;
}

export interface CrmQuoteRow {
  id: string;
  lead_id: string;
  quote_number: string;
  status: string;
  draft: CrmQuoteDraft;
  created_at: string;
  updated_at: string;
}

export interface CrmQuoteGenerateResult {
  generated: boolean;
  quote: CrmQuote | null;
  reason?: "not_eligible" | "not_configured" | "error";
}
