/**
 * CRM-Angebote – Konstanten
 */

export const CRM_QUOTES_TABLE = "crm_quotes";

/** Mindest-Vollständigkeit (0–100) für automatische Angebotserstellung. */
export const MIN_QUOTE_COMPLETENESS_SCORE = 57;

/** Gültigkeitsdauer des Angebots in Tagen. */
export const QUOTE_VALIDITY_DAYS = 30;

/** Standard-Lieferzeiten je Paket-ID. */
export const QUOTE_DELIVERY_BY_PACKAGE: Record<string, string> = {
  neukunde: "2 Wochen ab Auftragsbestätigung",
  starter: "4–6 Wochen ab Projektstart",
  professional: "6–8 Wochen ab Projektstart",
  enterprise: "8–12 Wochen ab Projektstart",
};

export const DEFAULT_QUOTE_DELIVERY =
  "4–6 Wochen ab Projektstart (individuell nach Abstimmung)";
