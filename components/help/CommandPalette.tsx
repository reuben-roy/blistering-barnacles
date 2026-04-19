"use client";

import { buildSearchIndex, filterSearchIndex } from "@/lib/search/build-index";
import type { SearchRecord } from "@/lib/search/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const index = buildSearchIndex();

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => filterSearchIndex(index, query), [query]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchRecord[]> = { Leads: [], Help: [], Pages: [] };
    for (const r of results) {
      g[r.group].push(r);
    }
    return g;
  }, [results]);

  const flat = useMemo(() => {
    return [...grouped.Leads, ...grouped.Help, ...grouped.Pages];
  }, [grouped]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [open]);

  const go = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(0, flat.length - 1)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const r = flat[active];
        if (r) go(r.href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, flat, go, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-24 w-[min(720px,calc(100%-2rem))] overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
        <div className="border-b border-border p-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, help, pages…"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="mt-2 text-xs text-muted">Tip: use arrow keys and Enter. Esc closes.</p>
        </div>
        <div className="max-h-[50vh] overflow-auto p-2">
          {(["Leads", "Help", "Pages"] as const).map((group) => {
            const rows = grouped[group];
            if (!rows.length) return null;
            return (
              <div key={group} className="mb-3">
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  {group}
                </div>
                <ul>
                  {rows.map((r) => {
                    const idx = flat.indexOf(r);
                    const selected = idx === active;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(r.href)}
                          className={`flex w-full flex-col rounded-md px-3 py-2 text-left text-sm ${
                            selected ? "bg-app-bg" : "hover:bg-app-bg"
                          }`}
                        >
                          <span className="font-medium text-text">{r.title}</span>
                          {r.subtitle ? <span className="text-xs text-muted">{r.subtitle}</span> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {!flat.length ? <div className="px-3 py-6 text-sm text-muted">No results.</div> : null}
        </div>
      </div>
    </div>
  );
}
