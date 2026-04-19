import test from "node:test";
import assert from "node:assert/strict";
import { parseStructuredAnswer } from "./anthropic";
import { isFrustrated } from "./prompt";
import { buildSupportFallback } from "./support";

test("parses structured Anthropic tool output", () => {
  const parsed = parseStructuredAnswer(
    {
      content: [
        {
          type: "tool_use",
          name: "submit_answer",
          input: {
            answer: "1. Click on Members.\n2. Click on Invite.",
            sourceIds: ["faq:invite-teammates"],
            insufficientContext: false,
          },
        },
      ],
    },
    new Set(["faq:invite-teammates"]),
  );

  assert.equal(parsed.insufficientContext, false);
  assert.deepEqual(parsed.sourceIds, ["faq:invite-teammates"]);
});

test("rejects malformed model payloads with no tool output", () => {
  assert.throws(
    () => parseStructuredAnswer({ content: [{ type: "text", text: "Hello" }] }, new Set(["faq:invite-teammates"])),
    /submit_answer tool/i,
  );
});

test("allows insufficient-context tool output without sources", () => {
  const parsed = parseStructuredAnswer(
    {
      content: [
        {
          type: "tool_use",
          name: "submit_answer",
          input: {
            answer: "I don't have enough detail.",
            sourceIds: [],
            insufficientContext: true,
          },
        },
      ],
    },
    new Set(["faq:invite-teammates"]),
  );

  assert.equal(parsed.insufficientContext, true);
  assert.deepEqual(parsed.sourceIds, []);
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
