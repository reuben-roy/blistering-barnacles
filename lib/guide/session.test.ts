import test from "node:test";
import assert from "node:assert/strict";
import { resolveGuideFlowSteps } from "./catalog";
import { findStartingStepIndex, visibleGuideStepsForRoute } from "./session";

test("starts a guide from the current page when later steps already match the route", () => {
  const steps = resolveGuideFlowSteps("profile-name");

  assert.equal(findStartingStepIndex(steps, "/app/settings/profile"), 1);
});

test("only returns visible remaining steps for the current route", () => {
  const steps = resolveGuideFlowSteps("profile-name");
  const visible = visibleGuideStepsForRoute(steps, "/app/settings/profile", 1);

  assert.deepEqual(
    visible.map((step) => step.index),
    [1, 2],
  );
});
