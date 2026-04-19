"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles } from "lucide-react";
import { org } from "@/lib/fixtures/org";
import { userProfile } from "@/lib/fixtures/user";
import Image from "next/image";

const modules = [
  { href: "/app/crm", label: "CRM" },
  { href: "/app/sales", label: "Sales" },
  { href: "/app/marketing", label: "Marketing" },
  { href: "/app/content", label: "Content" },
  { href: "/app/automation", label: "Automation" },
  { href: "/app/reporting", label: "Reporting" },
  { href: "/app/marketplace", label: "Marketplace" },
  { href: "/app/ai", label: "AI Copilots", icon: "sparkles" as const },
];

export function TopNav({
  onOpenSearch,
  onOpenMobileNav,
}: {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-surface px-3 sm:px-4">
      <button
        type="button"
        className="inline-flex rounded-md p-2 text-text hover:bg-app-bg md:hidden"
        aria-label="Open menu"
        onClick={onOpenMobileNav}
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/app" className="flex shrink-0 items-center gap-2">
        <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0" unoptimized />
        <span className="text-sm font-bold text-accent">BrokerDesk</span>
        <span className="hidden rounded-full bg-app-bg px-2 py-0.5 text-xs text-muted sm:inline">Demo</span>
      </Link>

      <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
        {modules.map((m) => {
          const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm ${
                active ? "bg-app-bg font-semibold text-accent" : "text-muted hover:bg-app-bg hover:text-text"
              }`}
            >
              {m.icon === "sparkles" ? <Sparkles className="h-4 w-4" /> : null}
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden w-56 items-center gap-2 rounded-md border border-border bg-app-bg px-3 py-2 text-left text-sm text-muted sm:flex"
        >
          <Search className="h-4 w-4" />
          Search…
          <span className="ml-auto text-xs">⌘K</span>
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex rounded-md border border-border p-2 sm:hidden"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </button>

        <details className="relative">
          <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Account menu</span>
            <Image
              src={userProfile.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-border"
              unoptimized
            />
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface p-2 text-sm shadow-lg">
            <div className="border-b border-border px-2 py-2">
              <div className="font-medium text-text">
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="text-xs text-muted">{org.name}</div>
            </div>
            <Link className="block rounded-md px-2 py-2 hover:bg-app-bg" href="/app/settings/profile">
              Profile
            </Link>
            <Link className="block rounded-md px-2 py-2 hover:bg-app-bg" href="/app/settings/account">
              Settings
            </Link>
            <button type="button" className="w-full rounded-md px-2 py-2 text-left hover:bg-app-bg" disabled>
              Sign out (demo)
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
