import { NextRequest, NextResponse } from "next/server";
import { queryRAG } from "@/lib/rag";
import type { OnboardingTechLevel } from "@/lib/rag";

function isRole(value: unknown): value is "user" | "assistant" {
  return value === "user" || value === "assistant";
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | {
        question?: unknown;
        history?: Array<{ role?: unknown; content?: unknown }>;
        userContext?: {
          onboardingDay?: unknown;
          techLevel?: unknown;
          completedSteps?: unknown;
        };
      }
    | null;

  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "No question provided" }, { status: 400 });
  }

  const history =
    body?.history
      ?.filter(
        (entry): entry is { role: "user" | "assistant"; content: string } =>
          isRole(entry.role) && typeof entry.content === "string" && entry.content.trim().length > 0,
      )
      .slice(-6) ?? [];

  const techLevel: OnboardingTechLevel | undefined =
    body?.userContext?.techLevel === "self-serve" || body?.userContext?.techLevel === "guided"
      ? body.userContext.techLevel
      : undefined;

  const userContext = {
    onboardingDay:
      typeof body?.userContext?.onboardingDay === "number" ? body.userContext.onboardingDay : undefined,
    techLevel,
    completedSteps: Array.isArray(body?.userContext?.completedSteps)
      ? body?.userContext?.completedSteps.filter((value): value is string => typeof value === "string")
      : undefined,
  };

  try {
    const result = await queryRAG(question, history, userContext);
    return NextResponse.json(result);
  } catch (error) {
    console.error("RAG error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong. Please contact support@lofty.com or call 1-855-981-7557.",
      },
      { status: 500 },
    );
  }
}
