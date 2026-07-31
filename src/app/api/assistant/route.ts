import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  isHoneypotTriggered,
  rateLimitResponse,
} from "@/lib/api/security";
import { AssistantServiceError } from "@/lib/assistant/errors";
import { processIndustryRecognition } from "@/lib/assistant/industry-recognition";
import { processLeadScoring } from "@/lib/assistant/lead-scoring";
import { processObjectionHandling } from "@/lib/assistant/objection-handling";
import { processPersonalityAnalysis } from "@/lib/assistant/personality-analysis";
import { processProjectBriefing } from "@/lib/assistant/project-briefing";
import { processRecommendations } from "@/lib/assistant/recommendations";
import { processSalesStrategy } from "@/lib/assistant/sales-strategy";
import { generateOpenAIResponse } from "@/lib/assistant/openai";
import {
  assistantRequestSchema,
  type AssistantRequest,
} from "@/lib/assistant/validation";

export const runtime = "nodejs";

function validationErrorResponse(errors: Record<string, string>) {
  return NextResponse.json({ success: false, errors }, { status: 400 });
}

function zodErrorsToRecord(
  issues: Array<{ path: (string | number)[]; message: string }>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "messages";
    errors[key] = issue.message;
  }
  return errors;
}

function handleAssistantError(error: unknown): NextResponse {
  if (error instanceof AssistantServiceError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.status }
    );
  }

  console.error("Unhandled assistant API error:", error);
  return NextResponse.json(
    {
      success: false,
      error:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ success: true, message: "" });
    }

    const result = assistantRequestSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(
        zodErrorsToRecord(result.error.errors)
      );
    }

    const { messages, sessionId } = result.data as AssistantRequest;

    if (messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Die letzte Nachricht muss vom Nutzer stammen.",
          code: "INVALID_CONVERSATION",
        },
        { status: 400 }
      );
    }

    let leadBehaviorPrompt: string | undefined;

    if (sessionId) {
      const { behaviorPrompt, scoreResult } = processLeadScoring(
        sessionId,
        messages
      );

      const { industryPrompt, result: industryResult } =
        processIndustryRecognition({ sessionId, messages });

      const { recommendationPrompt, result: recommendationResult } =
        processRecommendations({
          sessionId,
          messages,
          leadScoreResult: scoreResult,
        });

      const { objectionPrompt, result: objectionResult } =
        processObjectionHandling({ sessionId, messages });

      const { salesStrategyPrompt } = processSalesStrategy({
        sessionId,
        messages,
        leadCategory: scoreResult.category,
        hasActiveObjection: Boolean(objectionResult.primary),
      });

      const { personalityPrompt, result: personalityResult } =
        processPersonalityAnalysis({ sessionId, messages });

      const { briefingPrompt, result: briefingResult } = processProjectBriefing(
        { sessionId, messages }
      );

      leadBehaviorPrompt = [
        behaviorPrompt,
        industryPrompt,
        salesStrategyPrompt,
        recommendationPrompt,
        objectionPrompt,
        personalityPrompt,
        briefingPrompt,
      ]
        .filter(Boolean)
        .join("\n\n");

      // Internes Logging – interne Analysen werden nie an den Client zurückgegeben.
      console.info(
        `[lead-scoring] session=${sessionId} score=${scoreResult.score} category=${scoreResult.category}`
      );
      console.info(
        `[industry-recognition] session=${sessionId} status=${industryResult.status} industry=${industryResult.primary?.label ?? "unknown"}`
      );
      console.info(
        `[recommendations] session=${sessionId} package=${recommendationResult.primary.packageName} fit=${recommendationResult.primary.fitScore} addons=${recommendationResult.addOns.map((a) => a.name).join(",") || "none"}`
      );
      if (objectionResult.primary) {
        console.info(
          `[objection-handling] session=${sessionId} objection=${objectionResult.primary.type} confidence=${objectionResult.primary.confidence.toFixed(2)}`
        );
      }
      if (personalityResult.primary) {
        console.info(
          `[personality-analysis] session=${sessionId} profiles=${personalityResult.profiles.map((p) => p.type).join(",")}`
        );
      }
      console.info(
        `[project-briefing] session=${sessionId} confidence=${briefingResult.confidenceScore}% missing=${briefingResult.missingFields.length}`
      );
    }

    const message = await generateOpenAIResponse(messages, {
      leadBehaviorPrompt,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return handleAssistantError(error);
  }
}
