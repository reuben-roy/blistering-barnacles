import test from "node:test";
import assert from "node:assert/strict";
import { shouldUseGuideReply } from "./hybrid";
import type { GuideReply } from "./types";

function makeReply(overrides: Partial<GuideReply>): GuideReply {
  return {
    status: "match",
    message: "Path found.",
    flowId: "account-password",
    steps: [],
    confidence: 0.8,
    ...overrides,
  };
}

test("uses the guide for strong route matches", () => {
  assert.equal(shouldUseGuideReply(makeReply({ status: "match", confidence: 0.82 })), true);
});

test("does not use the guide for low-confidence matches", () => {
  assert.equal(shouldUseGuideReply(makeReply({ status: "match", confidence: 0.74 })), false);
});

test("does not use the guide for ambiguous replies", () => {
  assert.equal(shouldUseGuideReply(makeReply({ status: "ambiguous", confidence: 0.9 })), false);
});
