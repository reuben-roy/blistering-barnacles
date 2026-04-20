import { fetchDocContent } from "./fetch-doc";
import { buildSystemPrompt, buildUserPrompt, isFrustrated } from "./prompt";
import type { ConversationMessage, RAGUserContext, RetrievalHit, StructuredAnswer } from "./types";

const MAX_FETCH_ROUNDS = 3;

// ─── OpenAI types ────────────────────────────────────────────────────────────

type OpenAIToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type OpenAIMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: OpenAIToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
      tool_calls?: OpenAIToolCall[];
    };
  }>;
  error?: { message?: string };
};

// ─── Tool definitions ─────────────────────────────────────────────────────────

const FETCH_DOC_TOOL = {
  type: "function",
  function: {
    name: "fetch_doc_content",
    description:
      "Fetches the full text of a Lofty help center article by URL. Use this when a retrieved doc title is relevant but you need its body content to answer the question.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The help.lofty.com article URL to fetch.",
        },
      },
      required: ["url"],
    },
  },
} as const;

const SUBMIT_ANSWER_TOOL = {
  type: "function",
  function: {
    name: "submit_answer",
    description: "Return the grounded answer plus the source ids you used.",
    parameters: {
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
} as const;

// ─── Answer coercion ──────────────────────────────────────────────────────────

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

  const sourceIds = [
    ...new Set(
      record.sourceIds
        .filter((value): value is string => typeof value === "string")
        .filter((value) => allowedSourceIds.has(value)),
    ),
  ];

  return {
    answer: record.answer.trim(),
    sourceIds,
    insufficientContext: record.insufficientContext,
  };
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  messages: OpenAIMessage[],
  toolChoice: "auto" | { type: "function"; function: { name: string } },
): Promise<OpenAIResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o",
      max_tokens: 1200,
      messages,
      tools: [FETCH_DOC_TOOL, SUBMIT_ANSWER_TOOL],
      tool_choice: toolChoice,
    }),
  });

  const json = (await response.json()) as OpenAIResponse;
  if (!response.ok) {
    throw new Error(json.error?.message ?? `OpenAI request failed with status ${response.status}`);
  }
  return json;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function createGroundedAnswer(params: {
  question: string;
  history: ConversationMessage[];
  userContext?: RAGUserContext;
  answerHits: RetrievalHit[];
  docHits: RetrievalHit[];
}): Promise<StructuredAnswer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY.");

  const allowedSourceIds = new Set(params.answerHits.map((hit) => hit.record.id));

  const messages: OpenAIMessage[] = [
    { role: "system", content: buildSystemPrompt(isFrustrated(params.question, params.history)) },
    { role: "user", content: buildUserPrompt(params) },
  ];

  let fetchRounds = 0;

  // Tool loop: GPT may call fetch_doc_content up to MAX_FETCH_ROUNDS times
  // before it must call submit_answer.
  while (true) {
    const forceFinal = fetchRounds >= MAX_FETCH_ROUNDS;
    const toolChoice = forceFinal
      ? ({ type: "function", function: { name: "submit_answer" } } as const)
      : "auto";

    const response = await callOpenAI(apiKey, messages, toolChoice);
    const message = response.choices?.[0]?.message;

    if (!message) throw new Error("OpenAI returned an empty response.");

    const toolCalls = message.tool_calls ?? [];

    // No tool calls at all — shouldn't happen with tool_choice, but handle gracefully.
    if (toolCalls.length === 0) {
      throw new Error("OpenAI response contained no tool calls.");
    }

    // Check for submit_answer first (may appear alongside fetch calls).
    const submitCall = toolCalls.find((tc) => tc.function.name === "submit_answer");
    if (submitCall) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(submitCall.function.arguments);
      } catch {
        throw new Error("Failed to parse submit_answer arguments as JSON.");
      }
      return coerceStructuredAnswer(parsed, allowedSourceIds);
    }

    // Process all fetch_doc_content calls in this turn.
    const fetchCalls = toolCalls.filter((tc) => tc.function.name === "fetch_doc_content");
    if (fetchCalls.length === 0) {
      throw new Error("OpenAI called an unexpected tool.");
    }

    // Append the assistant message with its tool_calls, then tool results.
    messages.push({
      role: "assistant",
      content: message.content ?? null,
      tool_calls: toolCalls,
    });

    for (const fetchCall of fetchCalls) {
      let url = "";
      try {
        const args = JSON.parse(fetchCall.function.arguments) as { url?: unknown };
        url = typeof args.url === "string" ? args.url : "";
      } catch {
        // ignore parse error — will return error content below
      }

      const content = url ? await fetchDocContent(url) : null;

      messages.push({
        role: "tool",
        tool_call_id: fetchCall.id,
        content: content ?? "Unable to fetch content for that URL. Answer from what you already have.",
      });
    }

    fetchRounds += 1;
  }
}
