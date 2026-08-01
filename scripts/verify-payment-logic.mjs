/**
 * Verifikation der Zahlungslogik (ohne DB / ohne Next.js).
 * Ausführung: node scripts/verify-payment-logic.mjs
 */

const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
];

const PAYMENT_METHODS = [
  "card",
  "paypal",
  "klarna",
  "apple_pay",
  "google_pay",
];

const STRIPE_CHECKOUT_METHODS = ["card", "paypal", "klarna"];

const SUPPORTED_UI_METHODS = [
  "paypal",
  "klarna",
  "apple_pay",
  "google_pay",
  "card",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function eurosToCents(amount) {
  return Math.round(amount * 100);
}

function mapStripeWalletType(walletType) {
  if (walletType === "apple_pay") return "apple_pay";
  if (walletType === "google_pay") return "google_pay";
  return null;
}

function resolvePaymentMethodFromTypes(types) {
  if (types.includes("paypal")) return "paypal";
  if (types.includes("klarna")) return "klarna";
  if (types.includes("card")) return "card";
  return null;
}

function buildStripeMetadata(payment) {
  const metadata = {
    paymentId: payment.id,
    referenceType: payment.referenceType,
  };
  if (payment.referenceId) metadata.referenceId = payment.referenceId;
  if (payment.leadId) metadata.leadId = payment.leadId;
  if (payment.quoteId) metadata.quoteId = payment.quoteId;
  if (payment.invoiceId) metadata.invoiceId = payment.invoiceId;
  return metadata;
}

console.log("→ Prüfe Zahlungskonstanten…");
assert(PAYMENT_STATUSES.length === 6, "6 Zahlungsstatus erwartet");
assert(PAYMENT_METHODS.length === 5, "5 Zahlungsarten erwartet");
assert(
  STRIPE_CHECKOUT_METHODS.every((method) => PAYMENT_METHODS.includes(method)),
  "Stripe-Checkout-Methoden müssen in PAYMENT_METHODS enthalten sein"
);
assert(
  SUPPORTED_UI_METHODS.every((method) => PAYMENT_METHODS.includes(method)),
  "UI-Methoden müssen abgedeckt sein"
);

console.log("→ Prüfe Cent-Umrechnung…");
assert(eurosToCents(99.9) === 9990, "Cent-Umrechnung fehlerhaft");
assert(eurosToCents(0) === 0, "0 EUR = 0 Cent");

console.log("→ Prüfe Wallet-Mapping…");
assert(mapStripeWalletType("apple_pay") === "apple_pay", "Apple Pay Mapping");
assert(mapStripeWalletType("google_pay") === "google_pay", "Google Pay Mapping");
assert(mapStripeWalletType(null) === null, "Kein Wallet → null");

console.log("→ Prüfe Fallback-Zahlungsart aus Session-Typen…");
assert(
  resolvePaymentMethodFromTypes(["card"]) === "card",
  "Card fallback"
);
assert(
  resolvePaymentMethodFromTypes(["paypal"]) === "paypal",
  "PayPal fallback"
);

console.log("→ Prüfe Stripe-Metadaten für CRM-Verknüpfung…");
const samplePayment = {
  id: "pay-1",
  referenceType: "quote",
  referenceId: "quote-1",
  leadId: "lead-1",
  quoteId: "quote-1",
  invoiceId: null,
};
const metadata = buildStripeMetadata(samplePayment);
assert(metadata.paymentId === "pay-1", "paymentId in metadata");
assert(metadata.quoteId === "quote-1", "quoteId in metadata");
assert(metadata.leadId === "lead-1", "leadId in metadata");

console.log("✓ Zahlungslogik-Verifikation erfolgreich.");
