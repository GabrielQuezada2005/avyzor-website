/**
 * Proaktive Beratung – Typdefinitionen
 */

import type { ProjectBriefing } from "../project-briefing/types";
import type { ScoringMessage } from "../lead-scoring/types";

export type OpportunityId =
  | "terminbuchung"
  | "local_seo"
  | "career_page"
  | "ai_assistant"
  | "quote_automation"
  | "crm_integration"
  | "ecommerce";

export type RiskId =
  | "missing_goals"
  | "missing_industry"
  | "strategy_mismatch"
  | "budget_unclear"
  | "premature_scope";

export interface DetectedOpportunity {
  id: OpportunityId;
  label: string;
  recommendation: string;
  rationale: string;
  confidence: number;
}

export interface DetectedRisk {
  id: RiskId;
  label: string;
  explanation: string;
  alternative: string;
}

export interface PrioritizedGap {
  fieldId: string;
  label: string;
  tier: 1 | 2 | 3;
  askPriority: number;
  naturalQuestion: string;
}

export interface ProactiveConsultationResult {
  sessionId: string;
  opportunities: DetectedOpportunity[];
  risks: DetectedRisk[];
  prioritizedGaps: PrioritizedGap[];
  nextQuestion: PrioritizedGap | null;
  messageCount: number;
  updatedAt: string;
}

export interface ProactiveConsultationInput {
  sessionId: string;
  messages: ScoringMessage[];
  briefing: ProjectBriefing;
  industryLabel?: string | null;
  industryStatus?: "detected" | "uncertain" | "unknown";
}

export interface ProactiveConsultationPipelineResult {
  result: ProactiveConsultationResult;
  proactivePrompt: string;
}
