import test from "node:test";
import assert from "node:assert/strict";
import { resolveGuideIntent } from "./resolve";

test("resolves password help to the account password flow", () => {
  const reply = resolveGuideIntent("Where do I change my password?", "/app");

  assert.equal(reply.status, "match");
  assert.equal(reply.flowId, "account-password");
  assert.equal(reply.steps.length, 2);
});

test("treats username requests as an ambiguous profile-name match", () => {
  const reply = resolveGuideIntent("Where do I change the username?", "/app");

  assert.equal(reply.status, "ambiguous");
  assert.equal(reply.flowId, "profile-name");
  assert.match(reply.message, /email address/i);
});

test("returns a no-match response with suggestions for unknown asks", () => {
  const reply = resolveGuideIntent("How do I file my taxes in the app?", "/app");

  assert.equal(reply.status, "no-match");
  assert.ok(reply.suggestions && reply.suggestions.length > 0);
});

test("uses route context to steer CRM filtering questions", () => {
  const reply = resolveGuideIntent("show only hot leads", "/app/crm");

  assert.equal(reply.flowId, "crm-stage-filter");
});
