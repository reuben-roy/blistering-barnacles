import test from "node:test";
import assert from "node:assert/strict";
import { retrieveLocalContext } from "./retrieve";

test("retrieves FAQ answers from the local corpus", () => {
  const result = retrieveLocalContext("How do I invite teammates to my workspace?", null);

  assert.equal(result.insufficientContext, false);
  assert.equal(result.answerHits[0]?.record.id, "faq:invite-teammates");
});

test("retrieves glossary definitions from the local corpus", () => {
  const result = retrieveLocalContext("What does MLS mean?", null);

  assert.equal(result.insufficientContext, false);
  assert.equal(result.answerHits[0]?.record.id, "glossary:mls");
});

test("retrieves tutorial guidance from the local corpus", () => {
  const result = retrieveLocalContext("Where is the primary Help entry in this scaffold?", null);

  assert.equal(result.insufficientContext, false);
  assert.equal(result.answerHits[0]?.record.id, "tutorial:first-day");
});

test("retrieves guide flows for strong settings questions", () => {
  const result = retrieveLocalContext("How do I change my password?", null);

  assert.equal(result.insufficientContext, false);
  assert.equal(result.answerHits[0]?.record.id, "guide:account-password");
});

test("returns insufficient context for doc-title-only matches", () => {
  const result = retrieveLocalContext("How do I set up Facebook Pixel?", null);

  assert.equal(result.insufficientContext, true);
  assert.ok(result.docHits.some((hit) => hit.record.id === "doc:40545896421659"));
});
