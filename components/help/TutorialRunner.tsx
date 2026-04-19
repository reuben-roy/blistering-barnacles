"use client";

import type { Tutorial, TutorialStep } from "@/lib/help/tutorials.content";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { markStepComplete, readTutorialProgress } from "@/lib/storage/tutorial-progress";

export function TutorialRunner({ tutorial }: { tutorial: Tutorial }) {
  const [progress, setProgress] = useState(() => readTutorialProgress());
  const [quizWrong, setQuizWrong] = useState<string | null>(null);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [confirmAck, setConfirmAck] = useState(false);

  const completed = useMemo(
    () => progress[tutorial.id]?.completedStepIds ?? [],
    [progress, tutorial.id],
  );

  const firstIncompleteId = useMemo(() => {
    for (const s of tutorial.steps) {
      if (!completed.includes(s.id)) return s.id;
    }
    return tutorial.steps[0]?.id ?? "";
  }, [completed, tutorial.steps]);

  const [cursorId, setCursorId] = useState(firstIncompleteId);

  useEffect(() => {
    setCursorId((cur) => {
      if (!cur) return firstIncompleteId;
      return cur;
    });
  }, [firstIncompleteId]);

  function refresh() {
    setProgress(readTutorialProgress());
  }

  const current: TutorialStep | undefined = tutorial.steps.find((s) => s.id === cursorId) ?? tutorial.steps[0];

  useEffect(() => {
    setQuizWrong(null);
    setQuizPick(null);
    setConfirmAck(false);
  }, [current?.id]);

  function completeCurrent() {
    if (!current) return;
    markStepComplete(tutorial.id, current.id);
    refresh();
    const idx = tutorial.steps.findIndex((s) => s.id === current.id);
    const next = tutorial.steps[idx + 1];
    if (next) setCursorId(next.id);
  }

  const doneCount = completed.length;
  const total = tutorial.steps.length;
  const allDone = doneCount >= total;

  function submitQuiz() {
    if (!current?.quiz || quizPick === null) return;
    if (quizPick === current.quiz.correctIndex) {
      completeCurrent();
    } else {
      setQuizWrong(current.quiz.explanation);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="text-sm font-semibold">{tutorial.title}</div>
        <div className="mt-1 text-xs text-muted">
          {doneCount}/{total} steps · {tutorial.estimatedMinutes} min est.
        </div>
        <ol className="mt-4 space-y-2">
          {tutorial.steps.map((s) => {
            const done = completed.includes(s.id);
            const active = s.id === current?.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setCursorId(s.id)}
                  className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm ${
                    active ? "bg-app-bg" : "hover:bg-app-bg"
                  }`}
                >
                  <span className="mt-0.5 text-muted">
                    {done ? <Check className="h-4 w-4 text-accent" /> : <Circle className="h-4 w-4" />}
                  </span>
                  <span className={active ? "font-semibold text-text" : "text-muted"}>{s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <Link className="mt-4 inline-block text-sm text-accent hover:underline" href="/app/help/tutorials">
          Back to tutorials
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        {allDone ? (
          <div>
            <h2 className="text-lg font-semibold">Tutorial complete</h2>
            <p className="mt-2 text-sm text-muted">Progress is saved in localStorage for this browser.</p>
            <div className="mt-4">
              <Link className="text-sm text-accent hover:underline" href="/app/help">
                Return to Learning Hub
              </Link>
            </div>
          </div>
        ) : current ? (
          <div>
            <h2 className="text-lg font-semibold">{current.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{current.body}</p>

            {current.type === "quiz" && current.quiz ? (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium text-text">{current.quiz.prompt}</div>
                <div className="space-y-2">
                  {current.quiz.choices.map((c, i) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setQuizPick(i)}
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm ${
                        quizPick === i ? "border-accent bg-blue-50" : "border-border bg-surface hover:bg-app-bg"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <Button onClick={submitQuiz} disabled={quizPick === null}>
                  Submit answer
                </Button>
                {quizWrong ? <div className="rounded-md border border-border bg-app-bg p-3 text-sm">{quizWrong}</div> : null}
              </div>
            ) : null}

            {current.type === "read" ? (
              <div className="mt-6">
                <Button onClick={completeCurrent}>Mark complete</Button>
              </div>
            ) : null}

            {current.type === "navigate" && current.href ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={current.href}>
                  <Button variant="primary">Go to page</Button>
                </Link>
                <Button variant="secondary" onClick={completeCurrent}>
                  I am already there
                </Button>
              </div>
            ) : null}

            {current.type === "confirm" ? (
              <div className="mt-6 space-y-3">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-accent"
                    checked={confirmAck}
                    onChange={(e) => setConfirmAck(e.target.checked)}
                  />
                  <span>I confirm</span>
                </label>
                <Button onClick={completeCurrent} disabled={!confirmAck}>
                  Continue
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
