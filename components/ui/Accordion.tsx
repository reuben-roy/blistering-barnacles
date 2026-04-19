"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

export type AccordionItem = { id: string; title: string; content: ReactNode };

export function Accordion({
  items,
  allowMultiple = true,
  openId,
  onOpenChange,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  openId?: string | null;
  onOpenChange?: (id: string, open: boolean) => void;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (openId) {
      setOpen((o) => ({ ...o, [openId]: true }));
    }
  }, [openId]);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = { ...prev };
      const willOpen = !prev[id];
      if (!allowMultiple && willOpen) {
        for (const k of Object.keys(next)) next[k] = false;
      }
      next[id] = willOpen;
      onOpenChange?.(id, willOpen);
      return next;
    });
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {items.map((item) => {
        const panelId = `${baseId}-${item.id}-panel`;
        const headerId = `${baseId}-${item.id}-header`;
        const isOpen = Boolean(open[item.id]);
        return (
          <div key={item.id} id={item.id} className="scroll-mt-24">
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-app-bg"
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <span className="text-muted">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? (
              <div id={panelId} role="region" aria-labelledby={headerId} className="border-t border-border px-4 py-3 text-sm">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
