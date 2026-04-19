"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { docTopicLabels, getTopDocTopics, helpDocs } from "@/lib/help/docs.content";
import { tutorials } from "@/lib/help/tutorials.content";
import { faqItems } from "@/lib/help/faq.content";
import { bestResumeTutorial, readTutorialProgress, tutorialCompletionRatio } from "@/lib/storage/tutorial-progress";
import { filterSearchIndex, buildSearchIndex } from "@/lib/search/build-index";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const index = buildSearchIndex();

const pinned = ["first-day", "lead-routing", "tcpa-readiness"];

export function HelpHubClient() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const progress = useMemo(() => readTutorialProgress(), []);
  const resume = useMemo(() => bestResumeTutorial(tutorials, progress), [progress]);
  const featuredDocTopics = useMemo(() => getTopDocTopics(4), []);

  const results = useMemo(() => filterSearchIndex(index, q).slice(0, 10), [q]);

  return (
    <div className="space-y-6">
      <div>
        <Input
          label="Search the Learning Hub"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try TCPA, routing, profile…"
        />
        {q.trim() ? (
          <div className="mt-2 rounded-lg border border-border bg-surface">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                className="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-app-bg"
                onClick={() => router.push(r.href)}
              >
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted">
                  {r.group}
                  {r.subtitle ? ` · ${r.subtitle}` : ""}
                </div>
              </button>
            ))}
            {!results.length ? <div className="px-3 py-4 text-sm text-muted">No matches.</div> : null}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-semibold">Continue learning</div>
          {resume ? (
            <div className="mt-2 text-sm text-muted">
              <div className="font-medium text-text">{resume.title}</div>
              <div className="mt-1">
                Progress: {Math.round(100 * tutorialCompletionRatio(resume, progress))}%
              </div>
              <Link className="mt-3 inline-block text-sm text-accent hover:underline" href={`/app/help/tutorials/${resume.id}`}>
                Resume
              </Link>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted">Start a tutorial below.</div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold">Interactive tutorials</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {pinned.map((id) => {
              const t = tutorials.find((x) => x.id === id);
              if (!t) return null;
              return (
                <Link key={id} href={`/app/help/tutorials/${id}`} className="rounded-md border border-border p-3 hover:bg-app-bg">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="mt-1 text-xs text-muted">{t.estimatedMinutes} min</div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Official docs</div>
            <div className="mt-1 text-sm text-muted">
              {helpDocs.length} linked Lofty Help Center articles are indexed inside the Learning Hub.
            </div>
          </div>
          <Link className="text-sm text-accent hover:underline" href="/app/help/docs">
            Browse official docs
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {featuredDocTopics.map((topic) => (
            <span key={topic} className="rounded-full bg-app-bg px-2 py-0.5 text-xs text-muted">
              {docTopicLabels[topic]}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">FAQ highlights</div>
        <ul className="mt-3 space-y-2 text-sm">
          {faqItems.slice(0, 5).map((f) => (
            <li key={f.id}>
              <Link className="text-accent hover:underline" href={`/app/help/faq#${f.id}`}>
                {f.question}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="mt-3 inline-block text-sm text-accent hover:underline" href="/app/help/faq">
          Browse all FAQ
        </Link>
      </Card>
    </div>
  );
}
