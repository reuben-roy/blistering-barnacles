"use client";

import { useState, type ReactNode } from "react";

export type TabItem = { id: string; label: string; content: ReactNode };

export function Tabs({ items, defaultId }: { items: TabItem[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];
  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{current?.content}</div>
    </div>
  );
}
