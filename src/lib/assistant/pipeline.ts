/**
 * Assistant-Pipeline
 *
 * Führt alle Analyse-Module in sinnvoller Datenfluss-Reihenfolge aus
 * und komponiert den internen Verhaltens-Prompt.
 */

import { composeBehaviorPrompt } from "./prompt-orchestrator";
import { processIndustryRecognition } from "./industry-recognition";
import { processLeadScoring } from "./lead-scoring";
import { processObjectionHandling } from "./objection-handling";
import { processPersonalityAnalysis } from "./personality-analysis";
import { processProactiveConsultation } from "./proactive-consultation";
import { processProjectBriefing } from "./project-briefing";
import { processRecommendations } from "./recommendations";
import { processSalesStrategy } from "./sales-strategy";
import type { ScoringMessage } from "./lead-scoring/types";

export interface AssistantPipelineResult {
  behaviorPrompt: string;
  logs: string[];
}

/**
 * Führt die komplette interne Assistant-Pipeline aus.
 */
export function runAssistantPipeline(
  sessionId: string,
  messages: ScoringMessage[]
): AssistantPipelineResult {
  const logs: string[] = [];

  const { behaviorPrompt: leadBehavior, scoreResult } = processLeadScoring(
    sessionId,
    messages
  );
  logs.push(
    `[lead-scoring] session=${sessionId} score=${scoreResult.score} category=${scoreResult.category}`
  );

  const { industryPrompt, result: industryResult } = processIndustryRecognition(
    { sessionId, messages }
  );
  logs.push(
    `[industry-recognition] session=${sessionId} status=${industryResult.status} industry=${industryResult.primary?.label ?? "unknown"}`
  );

  const { briefingPrompt, result: briefingResult } = processProjectBriefing({
    sessionId,
    messages,
  });
  logs.push(
    `[project-briefing] session=${sessionId} confidence=${briefingResult.confidenceScore}% missing=${briefingResult.missingFields.length}`
  );

  const { proactivePrompt, result: proactiveResult } =
    processProactiveConsultation({
      sessionId,
      messages,
      briefing: briefingResult,
      industryLabel: industryResult.primary?.label ?? null,
      industryStatus: industryResult.status,
    });
  logs.push(
    `[proactive-consultation] session=${sessionId} opportunities=${proactiveResult.opportunities.length} risks=${proactiveResult.risks.length} nextQuestion=${proactiveResult.nextQuestion?.fieldId ?? "none"}`
  );

  const { recommendationPrompt, result: recommendationResult } =
    processRecommendations({
      sessionId,
      messages,
      leadScoreResult: scoreResult,
      briefing: briefingResult,
      industryCategory: industryResult.recommendationCategory,
    });
  logs.push(
    `[recommendations] session=${sessionId} offer=${recommendationResult.primary.packageName} fit=${recommendationResult.primary.fitScore} runnerUp=${recommendationResult.runnerUp?.packageName ?? "none"}`
  );

  const { objectionPrompt, result: objectionResult } =
    processObjectionHandling({ sessionId, messages });
  if (objectionResult.primary) {
    logs.push(
      `[objection-handling] session=${sessionId} objection=${objectionResult.primary.type} confidence=${objectionResult.primary.confidence.toFixed(2)}`
    );
  }

  const { salesStrategyPrompt } = processSalesStrategy({
    sessionId,
    messages,
    leadCategory: scoreResult.category,
    hasActiveObjection: Boolean(objectionResult.primary),
  });

  const { personalityPrompt, result: personalityResult } =
    processPersonalityAnalysis({ sessionId, messages });
  if (personalityResult.primary) {
    logs.push(
      `[personality-analysis] session=${sessionId} profiles=${personalityResult.profiles.map((p) => p.type).join(",")}`
    );
  }

  const behaviorPrompt = composeBehaviorPrompt({
    leadBehavior,
    industry: industryPrompt,
    briefing: briefingPrompt,
    proactive: proactivePrompt,
    salesStrategy: salesStrategyPrompt,
    recommendation: recommendationPrompt,
    objection: objectionPrompt,
    personality: personalityPrompt,
  });

  return { behaviorPrompt, logs };
}
