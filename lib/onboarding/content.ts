import type { TutorialProgressMap } from "@/lib/storage/tutorial-progress";

export const ONBOARDING_STEPS = [
  { id: "profile", label: "Complete your profile" },
  { id: "mls", label: "Connect your MLS feed" },
  { id: "website", label: "Set up your IDX website" },
  { id: "leads", label: "Import your first leads" },
  { id: "smart_plan", label: "Create your first Smart Plan" },
  { id: "ai_assistant", label: "Enable AI Assistant" },
  { id: "first_lead", label: "Contact your first lead" },
] as const;

const tutorialToStepMap: Record<string, Array<(typeof ONBOARDING_STEPS)[number]["id"]>> = {
  "first-day": ["profile"],
  "lead-routing": ["leads"],
  "ai-copilot-tour": ["ai_assistant"],
};

export function deriveCompletedOnboardingSteps(progress: TutorialProgressMap) {
  const completedStepIds = Object.entries(progress)
    .filter(([, value]) => value.completedStepIds.length > 0)
    .flatMap(([tutorialId]) => tutorialToStepMap[tutorialId] ?? []);

  return [...new Set(completedStepIds)]
    .map((stepId) => ONBOARDING_STEPS.find((step) => step.id === stepId))
    .filter((step): step is (typeof ONBOARDING_STEPS)[number] => Boolean(step))
    .map((step) => step.label);
}
