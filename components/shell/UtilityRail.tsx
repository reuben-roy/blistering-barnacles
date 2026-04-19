"use client";

import Link from "next/link";
import { Bell, HelpCircle, MessageSquare, Phone, Settings } from "lucide-react";
import { notifications } from "@/lib/fixtures/notifications";
import { useMemo, useRef, useState } from "react";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function UtilityRail() {
  const [open, setOpen] = useState(false);
  const unread = useMemo(() => notifications.filter((n) => n.unread).length, []);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className="flex h-full w-12 shrink-0 flex-col items-center gap-2 border-l border-border bg-surface py-3"
    >
      <button type="button" className="rounded-md p-2 text-muted hover:bg-app-bg hover:text-text" title="Phone (demo)">
        <Phone className="h-5 w-5" />
      </button>
      <button type="button" className="rounded-md p-2 text-muted hover:bg-app-bg hover:text-text" title="Messages (demo)">
        <MessageSquare className="h-5 w-5" />
      </button>

      <div className="relative">
        <button
          type="button"
          className="relative rounded-md p-2 text-muted hover:bg-app-bg hover:text-text"
          aria-expanded={open}
          title="Notifications"
          onClick={() => setOpen((v) => !v)}
        >
          <Bell className="h-5 w-5" />
          {unread ? (
            <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-danger px-1 text-center text-[10px] font-bold text-white">
              {unread}
            </span>
          ) : null}
        </button>
        {open ? (
          <>
            <button type="button" className="fixed inset-0 z-30" aria-label="Close notifications" onClick={() => setOpen(false)} />
            <div className="absolute right-full top-0 z-40 mr-2 w-80 max-w-[calc(100vw-6rem)] rounded-lg border border-border bg-surface p-2 shadow-lg">
              <div className="px-2 py-2 text-sm font-semibold">Notifications</div>
              <ul className="max-h-72 overflow-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="rounded-md px-2 py-2 hover:bg-app-bg">
                    <div className="text-sm text-text">{n.title}</div>
                    <div className="text-xs text-muted">{formatTime(n.at)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>

      <Link
        href="/app/help"
        className="rounded-md p-2 text-accent hover:bg-app-bg"
        title="Help"
        prefetch={false}
      >
        <HelpCircle className="h-5 w-5" />
      </Link>
      <Link href="/app/settings/profile" className="rounded-md p-2 text-muted hover:bg-app-bg hover:text-text" title="Settings">
        <Settings className="h-5 w-5" />
      </Link>
    </div>
  );
}
