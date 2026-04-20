import test from "node:test";
import assert from "node:assert/strict";
import { isFrustrated } from "./prompt";
import { buildSupportFallback } from "./support";

// Inline the coercion logic used by createGroundedAnswer so we can unit-test
// it without wiring up a real OpenAI round-trip.
function makeOpenAIResponse(toolName: string, args: unknown) {
  return {
    choices: [
      {
        message: {
          content: null,
          tool_calls: [
            {
              id: "call_test",
              type: "function" as const,
              function: { name: toolName, arguments: JSON.stringify(args) },
            },
          ],
        },
      },
    ],
  };
}

function extractSubmitAnswer(
  response: ReturnType<typeof makeOpenAIResponse>,
  allowedSourceIds: Set<string>,
) {
  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function.name !== "submit_answer") {
    throw new Error("OpenAI response did not contain the submit_answer tool call.");
  }
  const parsed = JSON.parse(toolCall.function.arguments) as {
    answer: string;
    sourceIds: string[];
    insufficientContext: boolean;
  };
  return {
    ...parsed,
    sourceIds: parsed.sourceIds.filter((id) => allowedSourceIds.has(id)),
  };
}

test("parses structured OpenAI tool output", () => {
  const response = makeOpenAIResponse("submit_answer", {
    answer: "1. Click on Members.\n2. Click on Invite.",
    sourceIds: ["faq:invite-teammates"],
    insufficientContext: false,
  });

  const parsed = extractSubmitAnswer(response, new Set(["faq:invite-teammates"]));

  assert.equal(parsed.insufficientContext, false);
  assert.deepEqual(parsed.sourceIds, ["faq:invite-teammates"]);
});

test("rejects response with no submit_answer tool call", () => {
  const response = makeOpenAIResponse("fetch_doc_content", { url: "https://help.lofty.com/hc/en-us/articles/123" });

  assert.throws(
    () => extractSubmitAnswer(response, new Set(["faq:invite-teammates"])),
    /submit_answer/i,
  );
});

test("allows insufficient-context tool output without sources", () => {
  const response = makeOpenAIResponse("submit_answer", {
    answer: "I don't have enough detail.",
    sourceIds: [],
    insufficientContext: true,
  });

  const parsed = extractSubmitAnswer(response, new Set(["faq:invite-teammates"]));

  assert.equal(parsed.insufficientContext, true);
  assert.deepEqual(parsed.sourceIds, []);
});

test("filters sourceIds not in the allowed set", () => {
  const response = makeOpenAIResponse("submit_answer", {
    answer: "Here is the answer.",
    sourceIds: ["faq:invite-teammates", "doc:99999999"],
    insufficientContext: false,
  });

  const parsed = extractSubmitAnswer(response, new Set(["faq:invite-teammates"]));

  assert.deepEqual(parsed.sourceIds, ["faq:invite-teammates"]);
});

test("detects frustrated language from the prompt text", () => {
  assert.equal(isFrustrated("I'm totally lost here"), true);
  assert.equal(isFrustrated("Where do I change my password?"), false);
});

test("builds a support fallback with Lofty contact details", () => {
  const fallback = buildSupportFallback();

  assert.equal(fallback.insufficientContext, true);
  assert.match(fallback.answer, /support@lofty\.com/i);
  assert.match(fallback.answer, /1-855-981-7557/i);
});
