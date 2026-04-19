"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CommandPalette } from "@/components/help/CommandPalette";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";
import { UtilityRail } from "./UtilityRail";

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const onOpenSearch = useCallback(() => setPaletteOpen(true), []);
  const onCloseSearch = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isK = e.key === "k" || e.key === "K";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      <TopNav onOpenSearch={onOpenSearch} onOpenMobileNav={() => setMobileNavOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:block">
          <SideNav />
        </div>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full shadow-xl">
              <SideNav onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 overflow-y-auto p-4 pb-20 sm:p-6 sm:pb-6">{children}</main>

        <div className="hidden sm:block">
          <UtilityRail />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-border bg-surface py-2 sm:hidden">
        <button type="button" className="text-xs text-muted" onClick={onOpenSearch}>
          Search
        </button>
        <button type="button" className="text-xs text-muted" onClick={() => setMobileNavOpen(true)}>
          Menu
        </button>
        <a className="text-xs text-accent" href="/app/help">
          Help
        </a>
      </div>

      <CommandPalette open={paletteOpen} onClose={onCloseSearch} />
    </div>
  );
}
