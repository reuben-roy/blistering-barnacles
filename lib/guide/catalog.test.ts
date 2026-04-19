import test from "node:test";
import assert from "node:assert/strict";
import { guideCatalogValidation, guideFlows, guideTargets } from "./catalog";
import { validateGuideCatalog } from "./validation";

test("guide catalog validates", () => {
  assert.equal(
    guideCatalogValidation.ok,
    true,
    guideCatalogValidation.errors.join("\n"),
  );
});

test("catalog validation catches duplicate targets", () => {
  const duplicateTarget = { ...guideTargets[0] };
  const result = validateGuideCatalog([guideTargets[0], duplicateTarget], []);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Duplicate target id/);
});

test("catalog validation catches missing target references", () => {
  const result = validateGuideCatalog(guideTargets, [
    {
      ...guideFlows[0],
      id: "broken-flow",
      steps: [{ ...guideFlows[0].steps[0], targetId: "missing.target" }],
    },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /missing target/i);
});
