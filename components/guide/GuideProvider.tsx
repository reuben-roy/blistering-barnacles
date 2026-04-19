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
import { getGuideFlow, resolveGuideFlowSteps } from "@/lib/guide/catalog";
import { queryGuideElement, requestGuideReveal, waitForNextFrame } from "@/lib/guide/dom";
import { guideExamplePrompts, resolveGuideIntent } from "@/lib/guide/resolve";
import { matchesGuideRoute } from "@/lib/guide/routes";
import { clampStepIndex, findStartingStepIndex } from "@/lib/guide/session";
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
  suggestions: string[];
  submitQuery: (query: string) => void;
  startFlow: (flowId: string) => void;
  stopFlow: () => void;
  jumpToStep: (index: number) => void;
  markStepComplete: (targetId: string) => void;
  skipStep: () => void;
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

  function submitQuery(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const reply = resolveGuideIntent(trimmed, pathname);
    setMessages((prev) => [...prev, buildMessage("user", trimmed), buildMessage("assistant", reply.message)]);
    setLastReply(reply);
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
    setActiveFlowId(null);
    setCurrentStepIndex(0);
    setSessionStatus("idle");
    setMissingTargetId(null);
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
    suggestions: lastReply?.suggestions ?? guideExamplePrompts,
    submitQuery,
    startFlow,
    stopFlow,
    jumpToStep,
    markStepComplete,
    skipStep,
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
