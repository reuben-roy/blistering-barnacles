"use client";

import { deriveCompletedOnboardingSteps } from "@/lib/onboarding/content";
import { readTutorialProgress } from "./tutorial-progress";
import type { OnboardingTechLevel, RAGUserContext } from "@/lib/rag";

const KEY = "onboardingContext.v1";

type StoredOnboardingContext = {
  techLevel: OnboardingTechLevel;
  startedAt: string;
};

function defaultState(): StoredOnboardingContext {
  return {
    techLevel: "guided",
    startedAt: new Date().toISOString(),
  };
}

export function readOnboardingContext() {
  if (typeof window === "undefined") return defaultState();

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<StoredOnboardingContext>;

    return {
      techLevel: parsed.techLevel === "self-serve" ? "self-serve" : "guided",
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : defaultState().startedAt,
    } satisfies StoredOnboardingContext;
  } catch {
    return defaultState();
  }
}

export function writeOnboardingContext(next: StoredOnboardingContext) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function setOnboardingTechLevel(techLevel: OnboardingTechLevel) {
  const current = readOnboardingContext();
  writeOnboardingContext({
    ...current,
    techLevel,
  });
}

function getOnboardingDay(startedAt: string, progressUpdatedAt: string[]) {
  const timestamps = [startedAt, ...progressUpdatedAt]
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));

  if (!timestamps.length) return undefined;

  const firstTimestamp = Math.min(...timestamps);
  const elapsedMs = Date.now() - firstTimestamp;
  return Math.max(1, Math.floor(elapsedMs / 86400000) + 1);
}

export function buildOnboardingUserContext(): RAGUserContext {
  const onboarding = readOnboardingContext();
  const tutorialProgress = readTutorialProgress();
  const completedSteps = deriveCompletedOnboardingSteps(tutorialProgress);
  const onboardingDay = getOnboardingDay(
    onboarding.startedAt,
    Object.values(tutorialProgress).map((entry) => entry.updatedAt),
  );

  return {
    onboardingDay,
    techLevel: onboarding.techLevel,
    completedSteps,
  };
}
