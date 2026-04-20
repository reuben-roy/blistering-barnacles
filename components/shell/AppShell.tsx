"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { GuideAssistantPanel } from "@/components/guide/GuideAssistant";
import { GuideOverlay } from "@/components/guide/GuideOverlay";
import { GuideProvider } from "@/components/guide/GuideProvider";
import { CommandPalette } from "@/components/help/CommandPalette";
import { SideNav } from "./SideNav";
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
    <GuideProvider>
      <div className="flex h-screen overflow-hidden bg-app-bg">
        <div className="hidden h-full md:block">
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
              <SideNav mobile onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 pb-20 sm:p-6 sm:pb-6">
              <div className="mb-4 hidden justify-end md:flex">
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted shadow-sm transition-colors hover:bg-app-bg"
                >
                  <Search className="h-4 w-4" />
                  Search
                  <span className="rounded-full bg-app-bg px-2 py-0.5 text-xs text-muted">⌘K</span>
                </button>
              </div>

              {children}
            </main>

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
          </div>

          <GuideAssistantPanel />

          <div className="hidden sm:block">
            <UtilityRail />
          </div>
        </div>

        <CommandPalette open={paletteOpen} onClose={onCloseSearch} />
        <GuideOverlay />
      </div>
    </GuideProvider>
  );
}
