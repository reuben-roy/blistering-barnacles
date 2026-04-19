"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, UserRound } from "lucide-react";
import { navGroups } from "./nav-config";
import { org } from "@/lib/fixtures/org";
import { readNavGroupState, setNavGroupOpen } from "@/lib/storage/nav-prefs";
import { useEffect, useMemo, useState } from "react";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((g) => [g.id, true])),
  );

  useEffect(() => {
    const stored = readNavGroupState();
    setOpenMap((prev) => {
      const next = { ...prev };
      for (const g of navGroups) {
        if (typeof stored[g.id] === "boolean") next[g.id] = stored[g.id] as boolean;
      }
      return next;
    });
  }, []);

  const anyOpen = useMemo(() => openMap, [openMap]);

  function toggleGroup(id: string) {
    setOpenMap((prev) => {
      const nextOpen = !prev[id];
      setNavGroupOpen(id, nextOpen);
      return { ...prev, [id]: nextOpen };
    });
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-sidebar text-sidebar-fg">
      <div className="border-b border-white/10 p-3">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 hover:bg-white/5 [&::-webkit-details-marker]:hidden">
            <UserRound className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-wide text-white/60">Personal</div>
              <div className="truncate text-sm font-medium">{org.name}</div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 group-open:rotate-180" />
          </summary>
          <div className="mt-2 rounded-md bg-sidebar-active px-2 py-2 text-xs text-white/80">
            Personal workspace (demo). No switching logic.
          </div>
        </details>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navGroups.map((group) => {
          const open = anyOpen[group.id] ?? true;
          return (
            <div key={group.id} className="mb-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/60 hover:bg-white/5"
                aria-expanded={open}
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open ? (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => onNavigate?.()}
                        className={`relative flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                          active ? "bg-sidebar-active text-white" : "text-sidebar-fg"
                        }`}
                      >
                        {active ? <span className="absolute left-0 top-1 bottom-1 w-1 rounded bg-accent" /> : null}
                        <span className={active ? "pl-2" : ""}>{item.label}</span>
                        {item.badge === "NEW" ? (
                          <span className="rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
