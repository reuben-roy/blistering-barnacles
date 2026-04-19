import { buildSystemPrompt, buildUserPrompt, isFrustrated } from "./prompt";
import type { ConversationMessage, RAGUserContext, RetrievalHit, StructuredAnswer } from "./types";

type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; name: string; input: unknown };

type AnthropicResponse = {
  content?: AnthropicContentBlock[];
  error?: { message?: string };
};

function coerceStructuredAnswer(input: unknown, allowedSourceIds: Set<string>): StructuredAnswer {
  if (!input || typeof input !== "object") {
    throw new Error("Structured answer payload was not an object.");
  }

  const record = input as {
    answer?: unknown;
    sourceIds?: unknown;
    insufficientContext?: unknown;
  };

  if (typeof record.answer !== "string" || !record.answer.trim()) {
    throw new Error("Structured answer is missing a non-empty answer.");
  }

  if (typeof record.insufficientContext !== "boolean") {
    throw new Error("Structured answer is missing insufficientContext.");
  }

  if (!Array.isArray(record.sourceIds)) {
    throw new Error("Structured answer is missing sourceIds.");
  }

  const sourceIds = [...new Set(record.sourceIds.filter((value): value is string => typeof value === "string"))].filter(
    (value) => allowedSourceIds.has(value),
  );

  if (!record.insufficientContext && sourceIds.length === 0) {
    throw new Error("Structured answer did not reference any allowed sources.");
  }

  return {
    answer: record.answer.trim(),
    sourceIds,
    insufficientContext: record.insufficientContext,
  };
}

export function parseStructuredAnswer(response: unknown, allowedSourceIds: Set<string>) {
  const record = response as AnthropicResponse | null;
  const toolUse = record?.content?.find(
    (block): block is Extract<AnthropicContentBlock, { type: "tool_use" }> =>
      block.type === "tool_use" && block.name === "submit_answer",
  );

  if (!toolUse) {
    const message = record?.error?.message ?? "Anthropic response did not contain the submit_answer tool.";
    throw new Error(message);
  }

  return coerceStructuredAnswer(toolUse.input, allowedSourceIds);
}

export async function createGroundedAnswer(params: {
  question: string;
  history: ConversationMessage[];
  userContext?: RAGUserContext;
  answerHits: RetrievalHit[];
  docHits: RetrievalHit[];
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY.");
  }

  const allowedSourceIds = new Set(params.answerHits.map((hit) => hit.record.id));
  const body = {
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 900,
    system: buildSystemPrompt(isFrustrated(params.question, params.history)),
    tools: [
      {
        name: "submit_answer",
        description: "Return the grounded answer plus the source ids you used.",
        input_schema: {
          type: "object",
          properties: {
            answer: {
              type: "string",
              description: "The final user-facing answer.",
            },
            sourceIds: {
              type: "array",
              items: { type: "string" },
              description: "IDs from the answer-bearing context that support the answer.",
            },
            insufficientContext: {
              type: "boolean",
              description: "True when the context is not enough to answer safely.",
            },
          },
          required: ["answer", "sourceIds", "insufficientContext"],
        },
      },
    ],
    tool_choice: {
      type: "tool",
      name: "submit_answer",
    },
    messages: [
      {
        role: "user",
        content: buildUserPrompt(params),
      },
    ],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as AnthropicResponse;
  if (!response.ok) {
    throw new Error(json.error?.message ?? `Anthropic request failed with status ${response.status}`);
  }

  return parseStructuredAnswer(json, allowedSourceIds);
}
