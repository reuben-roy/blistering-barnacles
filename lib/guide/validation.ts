import type { GuideFlow, GuideTarget } from "./types";

export type GuideCatalogValidation = {
  ok: boolean;
  errors: string[];
};

export function validateGuideCatalog(targets: GuideTarget[], flows: GuideFlow[]): GuideCatalogValidation {
  const errors: string[] = [];
  const targetIds = new Set<string>();
  const flowIds = new Set<string>();

  for (const target of targets) {
    if (targetIds.has(target.id)) {
      errors.push(`Duplicate target id: ${target.id}`);
    }
    targetIds.add(target.id);

    if (!target.route.startsWith("/")) {
      errors.push(`Invalid route for target ${target.id}: ${target.route}`);
    }

    if (!target.selector.includes("data-guide")) {
      errors.push(`Guide target selector must use a data-guide hook: ${target.id}`);
    }
  }

  for (const flow of flows) {
    if (flowIds.has(flow.id)) {
      errors.push(`Duplicate flow id: ${flow.id}`);
    }
    flowIds.add(flow.id);

    if (!flow.steps.length) {
      errors.push(`Flow ${flow.id} must include at least one step.`);
    }

    for (const step of flow.steps) {
      if (!targetIds.has(step.targetId)) {
        errors.push(`Flow ${flow.id} references missing target ${step.targetId}`);
      }
      if (step.routeOverride && !step.routeOverride.startsWith("/")) {
        errors.push(`Invalid route override on flow ${flow.id} step ${step.targetId}: ${step.routeOverride}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
