"use client";

import type { Tutorial } from "@/lib/help/tutorials.content";

const KEY = "tutorialProgress.v1";

export type TutorialProgressMap = Record<
  string,
  { completedStepIds: string[]; updatedAt: string }
>;

export function readTutorialProgress(): TutorialProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TutorialProgressMap;
  } catch {
    return {};
  }
}

export function writeTutorialProgress(map: TutorialProgressMap) {
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function markStepComplete(tutorialId: string, stepId: string) {
  const map = readTutorialProgress();
  const cur = map[tutorialId] ?? { completedStepIds: [], updatedAt: new Date().toISOString() };
  if (!cur.completedStepIds.includes(stepId)) {
    cur.completedStepIds = [...cur.completedStepIds, stepId];
  }
  cur.updatedAt = new Date().toISOString();
  map[tutorialId] = cur;
  writeTutorialProgress(map);
}

export function tutorialCompletionRatio(
  tutorial: Tutorial,
  map: TutorialProgressMap,
): number {
  const done = map[tutorial.id]?.completedStepIds.length ?? 0;
  return done / Math.max(1, tutorial.steps.length);
}

export function bestResumeTutorial(
  tutorialsList: Tutorial[],
  map: TutorialProgressMap,
): Tutorial | undefined {
  let best: Tutorial | undefined;
  let bestRatio = -1;
  for (const t of tutorialsList) {
    const r = tutorialCompletionRatio(t, map);
    if (r >= 1) continue;
    if (r > bestRatio) {
      bestRatio = r;
      best = t;
    }
  }
  return best;
}
