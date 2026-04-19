import { SHELL_ROUTE, matchesGuideRoute } from "./routes";
import type { ResolvedGuideStep } from "./types";

export function findStartingStepIndex(steps: ResolvedGuideStep[], pathname: string) {
  const currentRouteIndex = steps.findIndex(
    (step) => step.route !== SHELL_ROUTE && matchesGuideRoute(step.route, pathname),
  );

  return currentRouteIndex === -1 ? 0 : currentRouteIndex;
}

export function clampStepIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(Math.max(index, 0), total - 1);
}

export function visibleGuideStepsForRoute(
  steps: ResolvedGuideStep[],
  pathname: string,
  currentStepIndex: number,
) {
  return steps.filter((step) => step.index >= currentStepIndex && matchesGuideRoute(step.route, pathname));
}
