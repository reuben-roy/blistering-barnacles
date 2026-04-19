"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { buildOnboardingUserContext, readOnboardingContext, setOnboardingTechLevel } from "@/lib/storage/onboarding-context";
import { getGuideFlow, resolveGuideFlowSteps } from "@/lib/guide/catalog";
import { queryGuideElement, requestGuideReveal, waitForNextFrame } from "@/lib/guide/dom";
import { guideExamplePrompts, resolveGuideIntent } from "@/lib/guide/resolve";
import { matchesGuideRoute } from "@/lib/guide/routes";
import { clampStepIndex, findStartingStepIndex } from "@/lib/guide/session";
import { buildSupportFallback } from "@/lib/rag/support";
import { shouldUseGuideReply, toConversationHistory } from "@/lib/guide/hybrid";
import type { OnboardingTechLevel, RAGResult, RAGUserContext } from "@/lib/rag";
import type { GuideMessage, GuideReply, ResolvedGuideStep } from "@/lib/guide/types";

type GuideSessionStatus = "idle" | "guiding" | "complete";

type GuideContextValue = {
  assistantOpen: boolean;
  isDesktopGuide: boolean;
  messages: GuideMessage[];
  lastReply: GuideReply | null;
  previewFlowId: string | null;
  previewSteps: ResolvedGuideStep[];
  previewTitle: string | null;
  activeFlowId: string | null;
  activeFlowTitle: string | null;
  activeSteps: ResolvedGuideStep[];
  currentStepIndex: number;
  currentStep: ResolvedGuideStep | null;
  missingStep: ResolvedGuideStep | null;
  sessionStatus: GuideSessionStatus;
  ragResult: RAGResult | null;
  userContext: RAGUserContext;
  techLevel: OnboardingTechLevel;
  isSubmitting: boolean;
  suggestions: string[];
  submitQuery: (query: string) => Promise<void>;
  startFlow: (flowId: string) => void;
  stopFlow: () => void;
  jumpToStep: (index: number) => void;
  markStepComplete: (targetId: string) => void;
  skipStep: () => void;
  chooseTechLevel: (techLevel: OnboardingTechLevel) => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
};

const GuideContext = createContext<GuideContextValue | null>(null);

function buildMessage(role: GuideMessage["role"], text: string): GuideMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    createdAt: Date.now(),
  };
}

function useDesktopGuide() {
  const [isDesktopGuide, setIsDesktopGuide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktopGuide(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isDesktopGuide;
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktopGuide = useDesktopGuide();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>(() => [
    buildMessage(
      "assistant",
      "Ask where something lives in the app and I will map the path, then highlight the exact controls for you.",
    ),
  ]);
  const [lastReply, setLastReply] = useState<GuideReply | null>(null);
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<GuideSessionStatus>("idle");
  const [missingTargetId, setMissingTargetId] = useState<string | null>(null);
  const [ragResult, setRagResult] = useState<RAGResult | null>(null);
  const [techLevel, setTechLevelState] = useState<OnboardingTechLevel>("guided");
  const [userContext, setUserContext] = useState<RAGUserContext>({
    techLevel: "guided",
    completedSteps: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFlow = useMemo(() => (activeFlowId ? getGuideFlow(activeFlowId) : null), [activeFlowId]);
  const activeSteps = useMemo(
    () => (activeFlowId ? resolveGuideFlowSteps(activeFlowId) : []),
    [activeFlowId],
  );
  const currentStep =
    sessionStatus === "guiding" ? (activeSteps[currentStepIndex] ?? null) : null;
  const missingStep = useMemo(
    () => activeSteps.find((step) => step.target.id === missingTargetId) ?? null,
    [activeSteps, missingTargetId],
  );
  const previewFlow = useMemo(
    () => (lastReply?.flowId ? getGuideFlow(lastReply.flowId) : null),
    [lastReply],
  );

  useEffect(() => {
    if (isDesktopGuide) return;
    setAssistantOpen(false);
  }, [isDesktopGuide]);

  useEffect(() => {
    const onboarding = readOnboardingContext();
    setTechLevelState(onboarding.techLevel);
    setUserContext(buildOnboardingUserContext());
  }, []);

  useEffect(() => {
    if (!isDesktopGuide || sessionStatus !== "guiding" || !currentStep) return;
    const step = currentStep;

    let cancelled = false;

    async function syncCurrentStep() {
      setMissingTargetId(null);

      if (!matchesGuideRoute(step.route, pathname)) {
        router.push(step.route);
        return;
      }

      requestGuideReveal(step.target.reveal);
      await waitForNextFrame();
      await waitForNextFrame();

      if (cancelled) return;

      const element = queryGuideElement(step.target.selector);
      if (!element) {
        setMissingTargetId(step.target.id);
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    void syncCurrentStep();

    return () => {
      cancelled = true;
    };
  }, [currentStep, isDesktopGuide, pathname, router, sessionStatus]);

  useEffect(() => {
    if (!isDesktopGuide || sessionStatus !== "guiding" || !currentStep) return;
    const step = currentStep;
    if (!matchesGuideRoute(step.route, pathname)) return;

    const element = queryGuideElement(step.target.selector);
    if (!element) return;

    const eventName =
      step.target.kind === "input" || step.target.kind === "select"
        ? "focus"
        : "click";

    const onEngage = () => {
      setMissingTargetId(null);
      setCurrentStepIndex((prev) => {
        if (prev !== step.index) return prev;
        if (prev >= activeSteps.length - 1) {
          setSessionStatus("complete");
          return prev;
        }
        return prev + 1;
      });
    };

    element.addEventListener(eventName, onEngage, { once: true });
    return () => element.removeEventListener(eventName, onEngage);
  }, [activeSteps.length, currentStep, isDesktopGuide, pathname, sessionStatus]);

  function resetGuideSession() {
    setActiveFlowId(null);
    setCurrentStepIndex(0);
    setSessionStatus("idle");
    setMissingTargetId(null);
  }

  async function submitQuery(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMessage = buildMessage("user", trimmed);
    const reply = resolveGuideIntent(trimmed, pathname);
    const nextUserContext = buildOnboardingUserContext();
    setUserContext(nextUserContext);

    if (shouldUseGuideReply(reply)) {
      setMessages((prev) => [...prev, userMessage, buildMessage("assistant", reply.message)]);
      setLastReply(reply);
      setRagResult(null);
      setIsSubmitting(false);
    } else {
      setMessages((prev) => [...prev, userMessage]);
      setLastReply(null);
      setRagResult(null);
      setIsSubmitting(true);
      resetGuideSession();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmed,
            history: toConversationHistory([...messages, userMessage]),
            userContext: nextUserContext,
          }),
        });

        const payload = (await response.json()) as RAGResult | { error?: string };
        if (!response.ok) {
          throw new Error(
            "error" in payload && typeof payload.error === "string"
              ? payload.error
              : "Something went wrong. Please contact Lofty Support.",
          );
        }

        setRagResult(payload as RAGResult);
        setMessages((prev) => [
          ...prev,
          buildMessage(
            "assistant",
            (payload as RAGResult).insufficientContext
              ? "I couldn't find enough local detail to safely walk you through that, so I added the best next step below."
              : "I found the closest answer from the Learning Hub below.",
          ),
        ]);
      } catch {
        setRagResult(buildSupportFallback());
        setMessages((prev) => [
          ...prev,
          buildMessage(
            "assistant",
            "I hit a snag pulling the answer, so I added the safest next step below.",
          ),
        ]);
      } finally {
        setIsSubmitting(false);
      }
    }

    if (isDesktopGuide) {
      setAssistantOpen(true);
    }
  }

  function startFlow(flowId: string) {
    const steps = resolveGuideFlowSteps(flowId);
    if (!steps.length) return;

    setActiveFlowId(flowId);
    setCurrentStepIndex(findStartingStepIndex(steps, pathname));
    setSessionStatus("guiding");
    setMissingTargetId(null);
    if (isDesktopGuide) {
      setAssistantOpen(true);
    }
  }

  function stopFlow() {
    resetGuideSession();
  }

  function jumpToStep(index: number) {
    if (!activeSteps.length) return;
    setCurrentStepIndex(clampStepIndex(index, activeSteps.length));
    setSessionStatus("guiding");
    setMissingTargetId(null);
    if (isDesktopGuide) {
      setAssistantOpen(true);
    }
  }

  function markStepComplete(targetId: string) {
    if (!currentStep || currentStep.target.id !== targetId) return;

    setMissingTargetId(null);
    if (currentStepIndex >= activeSteps.length - 1) {
      setSessionStatus("complete");
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  }

  function skipStep() {
    if (!activeSteps.length) return;
    if (currentStepIndex >= activeSteps.length - 1) {
      setSessionStatus("complete");
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
    setMissingTargetId(null);
  }

  function chooseTechLevel(next: OnboardingTechLevel) {
    setOnboardingTechLevel(next);
    setTechLevelState(next);
    setUserContext(buildOnboardingUserContext());
  }

  const value: GuideContextValue = {
    assistantOpen,
    isDesktopGuide,
    messages,
    lastReply,
    previewFlowId: lastReply?.flowId ?? null,
    previewSteps: lastReply?.steps ?? [],
    previewTitle: previewFlow?.title ?? null,
    activeFlowId,
    activeFlowTitle: activeFlow?.title ?? null,
    activeSteps,
    currentStepIndex,
    currentStep,
    missingStep,
    sessionStatus,
    ragResult,
    userContext,
    techLevel,
    isSubmitting,
    suggestions: guideExamplePrompts,
    submitQuery,
    startFlow,
    stopFlow,
    jumpToStep,
    markStepComplete,
    skipStep,
    chooseTechLevel,
    openAssistant: () => setAssistantOpen(true),
    closeAssistant: () => setAssistantOpen(false),
    toggleAssistant: () => setAssistantOpen((prev) => !prev),
  };

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuideSession() {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error("useGuideSession must be used within a GuideProvider.");
  }
  return context;
}
