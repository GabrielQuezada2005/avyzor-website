/**
 * CRM-Angebote – Dienstleistungs-Matching zu Beispielpreisen
 */

import {
  NEUKUNDEN_PLAN,
  PRICING_PLANS,
  SERVICES,
} from "@/lib/constants";

export interface MatchedServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: readonly string[];
}

const PACKAGE_CATALOG: MatchedServicePackage[] = [
  {
    id: NEUKUNDEN_PLAN.id,
    name: NEUKUNDEN_PLAN.name,
    price: NEUKUNDEN_PLAN.price,
    description: NEUKUNDEN_PLAN.description,
    features: NEUKUNDEN_PLAN.features,
  },
  ...PRICING_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    description: plan.description,
    features: plan.features,
  })),
];

const SERVICE_KEYWORDS: Array<{ keywords: string[]; packageId: string }> = [
  {
    keywords: ["enterprise", "plattform", "automatisierung", "custom"],
    packageId: "enterprise",
  },
  {
    keywords: ["chatbot", "ki-chatbot", "bot", "crm", "automatisierung"],
    packageId: "professional",
  },
  {
    keywords: ["website", "webseite", "landing", "one-page", "seo"],
    packageId: "starter",
  },
  {
    keywords: ["einstieg", "neukunde", "start", "einfach"],
    packageId: "neukunde",
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function scorePackage(
  pkg: MatchedServicePackage,
  terms: string[]
): number {
  let score = 0;
  const haystack = [
    pkg.id,
    pkg.name,
    pkg.description,
    ...pkg.features,
  ]
    .join(" ")
    .toLowerCase();

  for (const term of terms) {
    if (haystack.includes(term)) score += 2;
  }

  for (const rule of SERVICE_KEYWORDS) {
    if (rule.packageId !== pkg.id) continue;
    for (const keyword of rule.keywords) {
      if (terms.some((term) => term.includes(keyword) || keyword.includes(term))) {
        score += 3;
      }
    }
  }

  return score;
}

function matchFromServicesCatalog(serviceText: string): MatchedServicePackage | null {
  const normalized = normalizeText(serviceText);

  for (const service of SERVICES) {
    const idMatch = normalized.includes(service.id.replace(/-/g, " "));
    const titleMatch = normalized.includes(normalizeText(service.title));
    if (idMatch || titleMatch) {
      if (normalized.includes("chatbot") || normalized.includes("bot")) {
        return PACKAGE_CATALOG.find((p) => p.id === "professional") ?? null;
      }
      if (normalized.includes("automatis")) {
        return PACKAGE_CATALOG.find((p) => p.id === "enterprise") ?? null;
      }
      return PACKAGE_CATALOG.find((p) => p.id === "starter") ?? null;
    }
  }

  return null;
}

/**
 * Ordnet Lead-Dienstleistungsangaben einem Beispielpaket zu.
 */
export function matchServicePackage(input: {
  service: string | null;
  detectedServices: string[];
  budget: string | null;
}): MatchedServicePackage {
  const terms = [input.service, ...input.detectedServices, input.budget]
    .filter(Boolean)
    .map((value) => normalizeText(value as string));

  if (terms.length === 0) {
    return PACKAGE_CATALOG[0];
  }

  const catalogMatch = input.service
    ? matchFromServicesCatalog(input.service)
    : null;
  if (catalogMatch) return catalogMatch;

  let best = PACKAGE_CATALOG[0];
  let bestScore = -1;

  for (const pkg of PACKAGE_CATALOG) {
    const score = scorePackage(pkg, terms);
    if (score > bestScore) {
      bestScore = score;
      best = pkg;
    }
  }

  if (bestScore === 0) {
    const combined = terms.join(" ");
    if (combined.includes("chatbot") || combined.includes("crm")) {
      return PACKAGE_CATALOG.find((p) => p.id === "professional") ?? best;
    }
  }

  return best;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
