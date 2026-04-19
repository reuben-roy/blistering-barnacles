"use client";

import type { FaqCategory, FaqItem } from "@/lib/help/faq.content";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Markdown } from "./Markdown";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaqHelpfulness } from "./FaqHelpfulness";

const categories: FaqCategory[] = [
  "GettingStarted",
  "Leads",
  "Compliance",
  "AI",
  "Integrations",
  "Billing",
];

function label(cat: FaqCategory) {
  return cat === "GettingStarted" ? "Getting started" : cat;
}

export function FaqClient({ items }: { items: FaqItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = (searchParams.get("cat") as FaqCategory | null) ?? null;
  const [hashId, setHashId] = useState<string | null>(null);

  useEffect(() => {
    function onHash() {
      const h = window.location.hash.replace(/^#/, "");
      setHashId(h || null);
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const filtered = useMemo(() => {
    if (!cat) return items;
    return items.filter((i) => i.category === cat);
  }, [cat, items]);

  const accordionItems = useMemo(
    () =>
      filtered.map((item) => ({
        id: item.id,
        title: item.question,
        content: (
          <div className="space-y-3">
            <Markdown text={item.answerMd} />
            {item.snippet ? (
              <div className="rounded-md border border-border bg-app-bg p-3">
                <div className="text-xs font-semibold text-muted">{item.snippet.label}</div>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-text">{item.snippet.text}</pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText(item.snippet!.text)}
                >
                  Copy snippet
                </Button>
              </div>
            ) : null}
            {item.relatedLinks?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.relatedLinks.map((l) => (
                  <Link key={l.href} className="text-sm text-accent hover:underline" href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <FaqHelpfulness itemId={item.id} />
          </div>
        ),
      })),
    [filtered],
  );

  const setCategory = useCallback(
    (next: FaqCategory | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!next) params.delete("cat");
      else params.set("cat", next);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Category</div>
        <div className="mt-2 flex flex-wrap gap-2 lg:flex-col">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full border px-3 py-1 text-left text-sm lg:rounded-md ${
              !cat ? "border-accent bg-blue-50 text-accent" : "border-border bg-surface"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-left text-sm lg:rounded-md ${
                cat === c ? "border-accent bg-blue-50 text-accent" : "border-border bg-surface"
              }`}
            >
              {label(c)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Accordion items={accordionItems} allowMultiple openId={hashId ?? undefined} />
      </div>
    </div>
  );
}
