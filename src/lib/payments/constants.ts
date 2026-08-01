/**
 * Zahlungen – Konstanten
 */

export const CRM_PAYMENTS_TABLE = "crm_payments";

/** Stripe Checkout – aktivierte Zahlungsarten (Apple/Google Pay über card-Wallets). */
export const STRIPE_CHECKOUT_PAYMENT_METHOD_TYPES = [
  "card",
  "paypal",
  "klarna",
] as const;

export const CRM_PAYMENT_STATUSES = [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
] as const;

export const CRM_PAYMENT_STATUS_LABELS: Record<
  (typeof CRM_PAYMENT_STATUSES)[number],
  string
> = {
  pending: "Ausstehend",
  processing: "In Bearbeitung",
  succeeded: "Bezahlt",
  failed: "Fehlgeschlagen",
  cancelled: "Abgebrochen",
  refunded: "Erstattet",
};

export const CRM_PAYMENT_REFERENCE_TYPES = ["plan", "quote", "invoice"] as const;

export const CRM_PAYMENT_METHOD_LABELS: Record<
  | "card"
  | "paypal"
  | "klarna"
  | "apple_pay"
  | "google_pay",
  string
> = {
  card: "Kreditkarte",
  paypal: "PayPal",
  klarna: "Klarna",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
};

export const SUPPORTED_PAYMENT_METHODS = [
  "paypal",
  "klarna",
  "apple_pay",
  "google_pay",
  "card",
] as const;
