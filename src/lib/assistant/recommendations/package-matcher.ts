/**
 * Empfehlungssystem – Paket-Matching
 *
 * Ermittelt intern: „Welches Paket bringt diesem Kunden den größten Mehrwert?"
 */

import { MIN_PACKAGE_FIT_SCORE, PACKAGE_PROFILES } from "./catalog/packages";
import type {
  CustomerNeeds,
  PackageRecommendation,
  PackageProfile,
} from "./types";
import type { LeadScoreResult } from "../lead-scoring/types";

function scoreBudgetFit(
  profile: PackageProfile,
  budget: LeadScoreResult["signals"]["budget"]
): number {
  if (profile.maxBudgetSignal.includes(budget)) return 25;
  if (budget === "none" || budget === "asked_about_price") return 10;
  return 0;
}

function scoreFeatureFit(
  profile: PackageProfile,
  features: CustomerNeeds["features"]
): number {
  if (features.length === 0) return 10;
  const matched = features.filter((f) => profile.features.includes(f));
  return Math.round((matched.length / features.length) * 30);
}

function scoreIndustryFit(
  profile: PackageProfile,
  industry: string | null
): number {
  if (!industry) return 5;
  return profile.industries.includes(industry) ? 15 : 5;
}

function scoreGrowthFit(
  profile: PackageProfile,
  growth: CustomerNeeds["growthPotential"]
): number {
  const order = ["none", "low", "medium", "high"];
  const profileMax = Math.max(
    ...profile.growthFit.map((g) => order.indexOf(g))
  );
  const customerLevel = order.indexOf(growth);
  if (profileMax >= customerLevel) return 15;
  return 5;
}

function scoreCompanyFit(
  profile: PackageProfile,
  companySize: LeadScoreResult["signals"]["companySize"]
): number {
  if (profile.minCompanySize.includes(companySize)) return 10;
  if (companySize === "unknown") return 5;
  return 3;
}

function scoreUrgencyFit(
  profile: PackageProfile,
  urgency: LeadScoreResult["signals"]["urgency"],
  timeframe: LeadScoreResult["signals"]["timeframe"]
): number {
  if (profile.id === "neukunde" && (timeframe === "immediate" || timeframe === "weeks")) {
    return 10;
  }
  if (urgency === "high" && profile.id !== "enterprise") return 8;
  return 5;
}

function buildReasons(
  profile: PackageProfile,
  needs: CustomerNeeds,
  fitScore: number
): string[] {
  const reasons: string[] = [];

  const matchedFeatures = needs.features.filter((f) =>
    profile.features.includes(f)
  );
  if (matchedFeatures.length > 0) {
    reasons.push(
      `Deckt Ihre gewünschten Funktionen ab (${matchedFeatures.join(", ")})`
    );
  }

  if (needs.goals.length > 0) {
    reasons.push(`Unterstützt Ihr Ziel: ${needs.goals[0]}`);
  }

  if (needs.industry && profile.industries.includes(needs.industry)) {
    reasons.push(`Bewährt in Ihrer Branche`);
  }

  if (reasons.length === 0) {
    reasons.push(profile.idealFor[0]);
  }

  if (fitScore >= 70) {
    reasons.push("Beste Übereinstimmung mit Ihren Anforderungen");
  }

  return reasons.slice(0, 3);
}

function buildValueProposition(
  profile: PackageProfile,
  needs: CustomerNeeds
): string {
  const parts: string[] = [];

  if (needs.goals.length > 0) {
    parts.push(needs.goals[0]);
  }

  const keyFeature = needs.features.find((f) => profile.features.includes(f));
  if (keyFeature) {
    parts.push(`inkl. ${keyFeature}`);
  }

  if (parts.length === 0) {
    return profile.idealFor[0];
  }

  return parts.join(" und ");
}

function createIndividualRecommendation(
  needs: CustomerNeeds,
  fitScore: number
): PackageRecommendation {
  const reasons = [
    "Kein Standardpaket deckt Ihre Anforderungen optimal ab",
    "Individuelle Lösung für maximale Passgenauigkeit",
  ];

  if (needs.features.length > 0) {
    reasons.push(
      `Maßgeschneidert für: ${needs.features.slice(0, 3).join(", ")}`
    );
  }

  return {
    type: "individual",
    packageId: null,
    packageName: "Individuelle Lösung",
    price: null,
    fitScore,
    reasons,
    valueProposition:
      needs.goals[0] ??
      "Eine maßgeschneiderte Lösung, die exakt zu Ihren Anforderungen passt",
  };
}

/**
 * Findet das Paket mit dem höchsten Mehrwert für den Kunden.
 */
export function matchPackage(
  needs: CustomerNeeds,
  leadScoreResult: LeadScoreResult
): PackageRecommendation {
  return matchPackagesWithAlternatives(needs, leadScoreResult).primary;
}

interface ScoredPackage {
  profile: PackageProfile;
  score: number;
  recommendation: PackageRecommendation;
}

function scoreProfile(
  profile: PackageProfile,
  needs: CustomerNeeds,
  signals: LeadScoreResult["signals"]
): number {
  return (
    scoreBudgetFit(profile, signals.budget) +
    scoreFeatureFit(profile, needs.features) +
    scoreIndustryFit(profile, needs.industry) +
    scoreGrowthFit(profile, needs.growthPotential) +
    scoreCompanyFit(profile, signals.companySize) +
    scoreUrgencyFit(profile, signals.urgency, signals.timeframe)
  );
}

function profileToRecommendation(
  profile: PackageProfile,
  needs: CustomerNeeds,
  score: number
): PackageRecommendation {
  return {
    type: "package",
    packageId: profile.id,
    packageName: profile.name,
    price: profile.price,
    fitScore: score,
    reasons: buildReasons(profile, needs, score),
    valueProposition: buildValueProposition(profile, needs),
  };
}

function findBudgetAlternative(
  primary: PackageRecommendation,
  scored: ScoredPackage[],
  signals: LeadScoreResult["signals"]
): PackageRecommendation | null {
  if (!primary.price) return null;

  const tightBudget =
    signals.budget === "low_budget" || signals.budget === "none";

  if (!tightBudget && primary.price <= 4990) return null;

  const cheaper = scored
    .filter(
      (s) =>
        s.recommendation.price &&
        s.recommendation.price < primary.price! &&
        s.recommendation.packageId !== primary.packageId
    )
    .sort((a, b) => b.score - a.score);

  return cheaper[0]?.recommendation ?? null;
}

/**
 * Ermittelt Hauptempfehlung, Alternative und Budget-Option.
 */
export function matchPackagesWithAlternatives(
  needs: CustomerNeeds,
  leadScoreResult: LeadScoreResult
): {
  primary: PackageRecommendation;
  runnerUp: PackageRecommendation | null;
  budgetAlternative: PackageRecommendation | null;
} {
  const { signals } = leadScoreResult;

  const scored: ScoredPackage[] = PACKAGE_PROFILES.map((profile) => {
    const score = scoreProfile(profile, needs, signals);
    return {
      profile,
      score,
      recommendation: profileToRecommendation(profile, needs, score),
    };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  if (!best || best.score < MIN_PACKAGE_FIT_SCORE) {
    const individual = createIndividualRecommendation(needs, best?.score ?? 0);
    return {
      primary: individual,
      runnerUp: best?.recommendation ?? null,
      budgetAlternative: null,
    };
  }

  const runnerUp =
    second && second.score >= best.score - 15 ? second.recommendation : null;

  const budgetAlternative = findBudgetAlternative(
    best.recommendation,
    scored,
    signals
  );

  return {
    primary: best.recommendation,
    runnerUp,
    budgetAlternative,
  };
}
