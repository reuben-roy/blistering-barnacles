"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useGuideSession } from "./GuideProvider";
import type { Source } from "@/lib/rag";

function sourceLabel(kind: Source["kind"]) {
  switch (kind) {
    case "faq":
      return "FAQ";
    case "glossary":
      return "Glossary";
    case "tutorial":
      return "Tutorial";
    case "guide":
      return "Guide";
    case "doc":
      return "Doc";
    default:
      return "Source";
  }
}

function SourceChips({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sources.map((source) => (
        <Link
          key={source.id}
          href={source.url}
          target={source.url.startsWith("http") ? "_blank" : undefined}
          rel={source.url.startsWith("http") ? "noreferrer" : undefined}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent"
        >
          <Badge className="shrink-0">{sourceLabel(source.kind)}</Badge>
          <span className="truncate">{source.title}</span>
        </Link>
      ))}
    </div>
  );
}

function AnswerStateCard() {
  const { ragResult, isSubmitting } = useGuideSession();

  if (isSubmitting) {
    return (
      <div className="rounded-2xl border border-border bg-app-bg/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text">
          <LoaderCircle className="h-4 w-4 animate-spin text-accent" />
          Looking through the Learning Hub
        </div>
        <p className="mt-2 text-sm text-muted">
          I&apos;m checking the local FAQ, glossary, tutorials, and guided flows for the closest grounded answer.
        </p>
      </div>
    );
  }

  if (!ragResult) return null;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        ragResult.insufficientContext
          ? "border-amber-200 bg-amber-50"
          : "border-border bg-app-bg/70"
      }`}
    >
      <div className="flex items-start gap-2">
        {ragResult.insufficientContext ? (
          <AlertCircle className="mt-0.5 h-4 w-4 text-amber-700" />
        ) : (
          <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-text">
            {ragResult.insufficientContext ? "Best next step" : "Grounded answer"}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text">{ragResult.answer}</p>
          <SourceChips sources={ragResult.sources} />
          {ragResult.insufficientContext ? (
            <div className="mt-4 text-xs text-amber-900">
              Lofty Support: {ragResult.supportContact.email} · {ragResult.supportContact.phone} ·{" "}
              {ragResult.supportContact.hours}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GuideAssistantSurface({ mode }: { mode: "panel" | "page" }) {
  const {
    activeFlowId,
    activeFlowTitle,
    activeSteps,
    assistantOpen,
    closeAssistant,
    currentStepIndex,
    messages,
    missingStep,
    previewFlowId,
    previewSteps,
    previewTitle,
    ragResult,
    sessionStatus,
    skipStep,
    startFlow,
    stopFlow,
    submitQuery,
    suggestions,
    techLevel,
    userContext,
    isSubmitting,
    jumpToStep,
    chooseTechLevel,
  } = useGuideSession();
  const [query, setQuery] = useState("");

  const stepsToRender = activeFlowId ? activeSteps : previewSteps;
  const title = activeFlowId ? activeFlowTitle : previewTitle;
  const showSteps = !ragResult && !isSubmitting && stepsToRender.length > 0;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    void submitQuery(query);
    setQuery("");
  }

  const shellClass =
    mode === "panel"
      ? "flex h-full flex-col bg-surface"
      : "rounded-2xl border border-border bg-surface shadow-sm";

  return (
    <section className={shellClass}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-accent">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-text">AI Assistant</div>
            <div className="text-xs text-muted">
              Ask where something lives or ask a broader onboarding question.
            </div>
          </div>
        </div>
        {mode === "panel" && assistantOpen ? (
          <button
            type="button"
            onClick={closeAssistant}
            className="rounded-md p-2 text-muted hover:bg-app-bg hover:text-text"
            aria-label="Close AI guide"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {mode === "page" ? (
          <div className="rounded-2xl border border-border bg-app-bg/70 p-4">
            <div className="text-sm font-semibold text-text">Answer style</div>
            <p className="mt-1 text-sm text-muted">
              Guided gives more hand-holding. Self-serve keeps the answers tighter.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-end">
              <Select
                label="Assistant style"
                value={techLevel}
                onChange={(event) => chooseTechLevel(event.target.value === "self-serve" ? "self-serve" : "guided")}
              >
                <option value="guided">Guided</option>
                <option value="self-serve">Self-serve</option>
              </Select>
              <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
                Day {userContext.onboardingDay ?? "?"}
                {userContext.completedSteps?.length
                  ? ` · Completed: ${userContext.completedSteps.join(", ")}`
                  : " · No completed onboarding steps yet"}
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void submitQuery(suggestion)}
              className="rounded-full border border-border bg-app-bg px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-accent"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm ${
                message.role === "assistant"
                  ? "bg-app-bg text-text"
                  : "ml-auto bg-accent text-white"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <AnswerStateCard />

        {showSteps ? (
          <div className="rounded-2xl border border-border bg-app-bg/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-text">{title}</div>
                <div className="mt-1 text-xs text-muted">
                  {activeFlowId
                    ? "Guided mode is live. Follow the numbered highlights in the UI."
                    : "Preview the steps first, then start the guide when you&apos;re ready."}
                </div>
              </div>
              {activeFlowId ? (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-accent">
                  {sessionStatus === "complete" ? "Complete" : "Guiding"}
                </span>
              ) : null}
            </div>

            <div className="mt-4 space-y-2">
              {stepsToRender.map((step, index) => {
                const done = activeFlowId ? index < currentStepIndex || sessionStatus === "complete" : false;
                const current = activeFlowId && sessionStatus === "guiding" && index === currentStepIndex;

                return (
                  <div
                    key={`${step.target.id}-${index}`}
                    className={`rounded-xl border px-3 py-3 ${
                      current
                        ? "border-accent bg-white"
                        : done
                          ? "border-green-200 bg-green-50"
                          : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-text">{step.title}</div>
                        <div className="mt-1 text-xs text-muted">{step.instruction}</div>
                      </div>
                      {activeFlowId ? (
                        <button
                          type="button"
                          onClick={() => jumpToStep(index)}
                          className="shrink-0 rounded-md px-2 py-1 text-xs text-accent hover:bg-blue-50"
                        >
                          Go to step
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {missingStep ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                I couldn&apos;t find the highlighted control for step {missingStep.index + 1} on this screen.
                <div className="mt-2">
                  <Link
                    className="text-amber-900 underline"
                    href={missingStep.target.fallbackHref ?? "/app/help"}
                  >
                    Open a fallback page
                  </Link>
                </div>
              </div>
            ) : null}

            {activeFlowId ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sessionStatus === "guiding" ? (
                  <Button variant="secondary" size="sm" onClick={skipStep}>
                    Skip
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={stopFlow}>
                  End guide
                </Button>
              </div>
            ) : previewFlowId ? (
              <div className="mt-4">
                <Button size="sm" onClick={() => startFlow(previewFlowId)}>
                  Start guide
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border px-4 py-3">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Ask the guide
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="How do I invite teammates or where do I change my password?"
            className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent"
          />
          <Button type="submit" className="shrink-0" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </section>
  );
}

export function GuideAssistantPanel() {
  const { assistantOpen, isDesktopGuide } = useGuideSession();

  if (!isDesktopGuide || !assistantOpen) return null;

  return (
    <aside className="hidden h-full w-[360px] shrink-0 border-l border-border md:block xl:w-[390px]">
      <GuideAssistantSurface mode="panel" />
    </aside>
  );
}

export function GuideAssistantPage() {
  return <GuideAssistantSurface mode="page" />;
}
