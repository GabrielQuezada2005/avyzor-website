/**
 * Verkaufsstrategie – Öffentliche API
 */

import { buildSalesStrategyPrompt, resolveStage } from "./prompt";
import type {
  SalesStrategyInput,
  SalesStrategyPipelineResult,
  SalesStrategyResult,
} from "./types";

export type {
  SalesStrategyInput,
  SalesStrategyPipelineResult,
  SalesStrategyResult,
} from "./types";

export { buildSalesStrategyPrompt } from "./prompt";

/**
 * Erzeugt interne Verkaufsstrategie-Anweisungen für die KI.
 */
export function processSalesStrategy(
  input: SalesStrategyInput
): SalesStrategyPipelineResult {
  const { sessionId, messages, leadCategory, hasActiveObjection = false } =
    input;

  const messageCount = messages.filter((m) => m.role === "user").length;

  const result: SalesStrategyResult = {
    sessionId,
    messageCount,
    conversationStage: resolveStage(messageCount, leadCategory ?? null),
    leadCategory: leadCategory ?? null,
    hasActiveObjection,
    updatedAt: new Date().toISOString(),
  };

  const salesStrategyPrompt = buildSalesStrategyPrompt(result);

  return { result, salesStrategyPrompt };
}
