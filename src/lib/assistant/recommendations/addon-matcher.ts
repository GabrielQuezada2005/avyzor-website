/**
 * Empfehlungssystem – Zusatzleistungs-Matching
 *
 * Empfiehlt Add-ons nur wenn sinnvoll – nicht im Paket enthalten,
 * zum Bedarf passend, nicht aufdringlich.
 */

import { ADDON_CATALOG } from "./catalog/addons";
import type { AddOnRecommendation, CustomerNeeds, PackageRecommendation } from "./types";
import type { LeadScoreResult, ScoringMessage } from "../lead-scoring/types";

const MAX_ADDONS = 2;

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join("\n");
}

/**
 * Empfiehlt passende Zusatzleistungen – maximal 2, nur bei Relevanz.
 */
export function matchAddOns(
  needs: CustomerNeeds,
  primary: PackageRecommendation,
  leadScoreResult: LeadScoreResult,
  messages: ScoringMessage[]
): AddOnRecommendation[] {
  const text = joinUserText(messages);
  const packageId = primary.packageId ?? "";
  const recommendations: AddOnRecommendation[] = [];

  for (const addon of ADDON_CATALOG) {
    if (addon.includedInPackages.includes(packageId)) continue;

    if (addon.minLeadScore && leadScoreResult.score < addon.minLeadScore) continue;

    if (
      addon.industries &&
      needs.industry &&
      !addon.industries.includes(needs.industry)
    ) {
      continue;
    }

    const keywordMatch = addon.keywords.some((k) => k.test(text));
    const featureMatch = needs.features.includes(addon.feature);

    if (!keywordMatch && !featureMatch) continue;

    let relevanceScore = 0;
    if (keywordMatch) relevanceScore += 50;
    if (featureMatch) relevanceScore += 40;
    if (needs.industry && addon.industries?.includes(needs.industry)) {
      relevanceScore += 10;
    }

    recommendations.push({
      id: addon.id,
      name: addon.name,
      reasons: [addon.reasonTemplates[0]],
      relevanceScore,
    });
  }

  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, MAX_ADDONS);
}
