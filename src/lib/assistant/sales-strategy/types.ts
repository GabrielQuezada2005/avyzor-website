/**
 * Verkaufsstrategie – Typdefinitionen
 */

import type { LeadCategory } from "../lead-scoring/types";
import type { ScoringMessage } from "../lead-scoring/types";

export interface SalesStrategyInput {
  sessionId: string;
  messages: ScoringMessage[];
  leadCategory?: LeadCategory;
  hasActiveObjection?: boolean;
}

export interface SalesStrategyResult {
  sessionId: string;
  messageCount: number;
  conversationStage: "early" | "developing" | "ready";
  leadCategory: LeadCategory | null;
  hasActiveObjection: boolean;
  updatedAt: string;
}

export interface SalesStrategyPipelineResult {
  result: SalesStrategyResult;
  salesStrategyPrompt: string;
}
