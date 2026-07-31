import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  isHoneypotTriggered,
  rateLimitResponse,
} from "@/lib/api/security";
import { AssistantServiceError } from "@/lib/assistant/errors";
import { runAssistantPipeline } from "@/lib/assistant/pipeline";
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
      const pipeline = runAssistantPipeline(sessionId, messages);
      leadBehaviorPrompt = pipeline.behaviorPrompt;
      for (const line of pipeline.logs) {
        console.info(line);
      }
    }

    const message = await generateOpenAIResponse(messages, {
      leadBehaviorPrompt,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return handleAssistantError(error);
  }
}
