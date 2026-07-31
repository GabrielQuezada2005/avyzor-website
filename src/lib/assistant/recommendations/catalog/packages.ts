/**
 * Empfehlungssystem – Paket-Katalog
 *
 * Basiert auf constants.ts – zentral für Matching-Logik.
 * Neue Pakete: hier registrieren.
 */

import { NEUKUNDEN_PLAN, PRICING_PLANS } from "@/lib/constants";
import type { PackageProfile } from "../types";

export const PACKAGE_PROFILES: PackageProfile[] = [
  {
    id: NEUKUNDEN_PLAN.id,
    name: NEUKUNDEN_PLAN.name,
    price: NEUKUNDEN_PLAN.price,
    maxBudgetSignal: ["none", "asked_about_price", "low_budget"],
    minCompanySize: ["unknown", "solo"],
    features: ["website"],
    industries: ["handwerk", "friseur", "gastro", "beratung"],
    growthFit: ["none", "low"],
    idealFor: [
      "Erster Online-Auftritt mit schlankem Budget",
      "Professionelle Landing Page ohne Premium-Umfang",
      "Schneller Einstieg in 2 Wochen",
    ],
  },
  {
    id: PRICING_PLANS[0].id,
    name: PRICING_PLANS[0].name,
    price: PRICING_PLANS[0].price,
    maxBudgetSignal: ["asked_about_price", "low_budget", "medium_budget"],
    minCompanySize: ["solo", "small", "medium"],
    features: ["website", "seo", "terminbuchung", "hosting"],
    industries: ["handwerk", "friseur", "gastro", "fitness", "immobilien"],
    growthFit: ["low", "medium"],
    idealFor: [
      "Premium One-Page Website mit Terminbuchung",
      "Lokale Sichtbarkeit und professionelle Kundengewinnung",
      "Ambitionierte KMU mit klarem Online-Ziel",
    ],
  },
  {
    id: PRICING_PLANS[1].id,
    name: PRICING_PLANS[1].name,
    price: PRICING_PLANS[1].price,
    maxBudgetSignal: ["medium_budget", "high_budget"],
    minCompanySize: ["small", "medium", "large"],
    features: [
      "website",
      "seo",
      "terminbuchung",
      "chatbot",
      "crm",
      "automatisierung",
    ],
    industries: ["immobilien", "medtech", "fintech", "agentur", "beratung"],
    growthFit: ["medium", "high"],
    idealFor: [
      "Multi-Page Website mit KI-Chatbot und CRM",
      "Umfassende digitale Präsenz mit Automatisierung",
      "Unternehmen mit Wachstumsambitionen",
    ],
  },
  {
    id: PRICING_PLANS[2].id,
    name: PRICING_PLANS[2].name,
    price: PRICING_PLANS[2].price,
    maxBudgetSignal: ["high_budget", "premium_budget"],
    minCompanySize: ["medium", "large"],
    features: [
      "website",
      "seo",
      "chatbot",
      "crm",
      "automatisierung",
      "ecommerce",
      "performance",
    ],
    industries: ["medtech", "fintech", "ecommerce", "logistik"],
    growthFit: ["high"],
    idealFor: [
      "Vollständige Digital-Plattform mit Custom-Automatisierungen",
      "Enterprise-Anforderungen mit dediziertem Ansprechpartner",
      "Skalierung und Multi-Channel-Strategie",
    ],
  },
];

/** Mindest-Fit-Score (0–100), ab dem ein Paket empfohlen wird. */
export const MIN_PACKAGE_FIT_SCORE = 45;
