"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  docTopicCounts,
  docTopicLabels,
  docTopicOrder,
  helpDocs,
  type DocTopic,
} from "@/lib/help/docs.content";

type TopicFilter = DocTopic | "all";

export function DocsLibraryClient() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("all");

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...helpDocs]
      .filter((doc) => {
        if (topic !== "all" && doc.topic !== topic) return false;
        if (!q) return true;

        const haystack = `${doc.title} ${doc.sourceSection ?? ""} ${docTopicLabels[doc.topic]}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  }, [query, topic]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <Input
          label="Search official docs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try routing, AI assistant, document templates..."
        />
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">Catalog size</div>
          <div className="mt-2 text-2xl font-semibold text-text">{helpDocs.length}</div>
          <div className="mt-1 text-sm text-muted">Official Lofty help articles linked from this demo.</div>
        </Card>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Topic</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopic("all")}
            className={`rounded-full border px-3 py-1 text-sm ${
              topic === "all" ? "border-accent bg-blue-50 text-accent" : "border-border bg-surface text-text"
            }`}
          >
            All ({helpDocs.length})
          </button>
          {docTopicOrder
            .filter((entry) => docTopicCounts[entry] > 0)
            .map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setTopic(entry)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  topic === entry ? "border-accent bg-blue-50 text-accent" : "border-border bg-surface text-text"
                }`}
              >
                {docTopicLabels[entry]} ({docTopicCounts[entry]})
              </button>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-text">{filteredDocs.length} matching articles</div>
        {query || topic !== "all" ? (
          <button
            type="button"
            className="text-sm text-accent hover:underline"
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredDocs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/app/help/docs/${doc.id}`} className="text-sm font-semibold text-text hover:text-accent hover:underline">
                  {doc.title}
                </Link>
                <Badge tone="accent" className="shrink-0">
                  {docTopicLabels[doc.topic]}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-muted">
                {doc.sourceSection ? `Section: ${doc.sourceSection}` : "Official Lofty Help Center article"}
              </div>
              <div className="mt-auto pt-4">
                <Link
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  Open official article
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-sm font-semibold text-text">No matching docs</div>
          <p className="mt-2 text-sm text-muted">Try a broader keyword or switch back to All topics.</p>
        </Card>
      )}
    </div>
  );
}
