"use client";

import { useMemo, useState } from "react";
import type { GlossaryEntry } from "@/lib/help/glossary.content";
import { Input } from "@/components/ui/Input";

export function GlossaryClient({ entries }: { entries: GlossaryEntry[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter((e) => `${e.term} ${e.definition}`.toLowerCase().includes(s));
  }, [entries, q]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map((e) => e.term[0]?.toUpperCase() ?? ""));
    return Array.from(set).sort();
  }, [filtered]);

  return (
    <div className="space-y-4">
      <Input placeholder="Filter terms" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex flex-wrap gap-2 text-xs">
        {letters.map((l) => (
          <a key={l} className="rounded-md border border-border px-2 py-1 hover:bg-app-bg" href={`#letter-${l}`}>
            {l}
          </a>
        ))}
      </div>
      <dl className="space-y-4">
        {filtered.map((e) => (
          <div key={e.term} id={`letter-${e.term[0]?.toUpperCase() ?? "A"}`} className="scroll-mt-24">
            <dt className="text-sm font-semibold text-text">{e.term}</dt>
            <dd className="mt-1 text-sm text-muted">{e.definition}</dd>
          </div>
        ))}
      </dl>
      {!filtered.length ? <div className="text-sm text-muted">No matches.</div> : null}
    </div>
  );
}
