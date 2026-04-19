"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { GUIDE_OPEN_NAV_GROUP_EVENT } from "@/lib/guide/dom";
import { org } from "@/lib/fixtures/org";
import { userProfile } from "@/lib/fixtures/user";
import {
  readNavCollapsed,
  readNavGroupState,
  setNavCollapsed,
  setNavGroupOpen,
} from "@/lib/storage/nav-prefs";
import {
  flattenSectionLinks,
  isNavLink,
  navSections,
  sidebarAccountLinks,
  type NavLink,
  type NavSection,
  type NavSectionItem,
} from "./nav-config";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemIsActive(pathname: string, item: NavSectionItem) {
  if (isNavLink(item)) {
    return isActive(pathname, item.href);
  }

  return item.items.some((child) => isActive(pathname, child.href));
}

function sectionIsActive(pathname: string, section: NavSection) {
  return flattenSectionLinks(section).some((item) => isActive(pathname, item.href));
}

type SideNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function SideNav({ mobile = false, onNavigate }: SideNavProps) {
  const pathname = usePathname();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navSections.map((section) => [section.id, true])),
  );
  const [collapsed, setCollapsed] = useState(false);
  const [flyoutId, setFlyoutId] = useState<string | null>(null);

  const railMode = !mobile && collapsed;

  useEffect(() => {
    const storedGroups = readNavGroupState();
    const storedCollapsed = readNavCollapsed();

    setOpenMap((prev) => {
      const next = { ...prev };
      for (const section of navSections) {
        if (typeof storedGroups[section.id] === "boolean") {
          next[section.id] = storedGroups[section.id] as boolean;
        }
      }
      return next;
    });

    setCollapsed(!mobile && storedCollapsed);
  }, [mobile]);

  useEffect(() => {
    setFlyoutId(null);
  }, [pathname]);

  useEffect(() => {
    function onGuideOpen(event: Event) {
      const detail = (event as CustomEvent<{ groupId?: string; expandShell?: boolean }>).detail;
      const groupId = detail?.groupId;
      if (!groupId) return;

      if (!mobile && detail.expandShell) {
        setCollapsed(false);
        setNavCollapsed(false);
      }

      setOpenMap((prev) => {
        if (prev[groupId]) return prev;
        setNavGroupOpen(groupId, true);
        return { ...prev, [groupId]: true };
      });
    }

    window.addEventListener(GUIDE_OPEN_NAV_GROUP_EVENT, onGuideOpen);
    return () => window.removeEventListener(GUIDE_OPEN_NAV_GROUP_EVENT, onGuideOpen);
  }, [mobile]);

  function toggleSection(id: string) {
    setOpenMap((prev) => {
      const nextOpen = !prev[id];
      setNavGroupOpen(id, nextOpen);
      return { ...prev, [id]: nextOpen };
    });
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    setNavCollapsed(next);
    if (!next) {
      setFlyoutId(null);
    }
  }

  function closeFlyout(id: string) {
    setFlyoutId((prev) => (prev === id ? null : prev));
  }

  function renderLink(link: NavLink, options?: { nested?: boolean; onClick?: () => void }) {
    const active = isActive(pathname, link.href);
    const Icon = link.icon;

    return (
      <Link
        key={link.id}
        href={link.href}
        onClick={() => {
          options?.onClick?.();
          onNavigate?.();
        }}
        data-guide={`shell.sidenav.link.${link.id}`}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
          active ? "bg-sidebar-active text-white" : "text-sidebar-fg"
        } ${options?.nested ? "ml-3" : ""}`}
      >
        {active ? <span className="absolute bottom-1 left-0 top-1 w-1 rounded bg-accent" /> : null}
        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-white/70"}`} />
        <span className={active ? "font-medium" : ""}>{link.label}</span>
        {link.badge === "NEW" ? (
          <span className="ml-auto rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
        ) : null}
      </Link>
    );
  }

  function renderSectionItems(section: NavSection, options?: { flyout?: boolean }) {
    return (
      <div className={options?.flyout ? "space-y-3" : "mt-2 space-y-2"}>
        {section.items.map((item) => {
          if (isNavLink(item)) {
            return renderLink(item, { onClick: () => closeFlyout(section.id) });
          }

          const active = itemIsActive(pathname, item);
          const GroupIcon = item.icon;

          return (
            <div key={item.id} className="rounded-2xl bg-white/[0.04] px-2 py-2">
              <div className={`flex items-center gap-2 px-1 py-1 text-sm ${active ? "text-white" : "text-white/80"}`}>
                <GroupIcon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="mt-2 space-y-1 border-l border-white/10 pl-2">
                {item.items.map((child) =>
                  renderLink(child, {
                    nested: true,
                    onClick: () => closeFlyout(section.id),
                  }),
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col bg-sidebar text-sidebar-fg transition-[width] duration-200 ${
        mobile ? "w-[304px]" : railMode ? "w-[88px]" : "w-[304px]"
      }`}
    >
      <div className="border-b border-white/10 px-3 py-4">
        <div className={railMode ? "space-y-3 text-center" : "flex items-start gap-3"}>
          <Link
            href="/app"
            onClick={() => onNavigate?.()}
            className={`flex min-w-0 items-center ${railMode ? "justify-center" : "flex-1 gap-3"}`}
            title="Lofty"
          >
            <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9 shrink-0" unoptimized />
            {!railMode ? (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-base font-semibold text-white">Lofty</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                    Demo
                  </span>
                </div>
                <div className="truncate text-xs text-white/60">{org.name}</div>
              </div>
            ) : null}
          </Link>

          {!mobile ? (
            <button
              type="button"
              className="inline-flex rounded-xl border border-white/10 p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={railMode ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleCollapsed}
            >
              {railMode ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </button>
          ) : null}
        </div>

        {!railMode ? (
          <div className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/70">
            Personal workspace. Navigation is tuned for the daily realtor workflow.
          </div>
        ) : null}
      </div>

      <nav className={`flex-1 overflow-y-auto ${railMode ? "px-2 py-3" : "px-3 py-4"}`}>
        {navSections.map((section) => {
          const open = openMap[section.id] ?? true;
          const active = sectionIsActive(pathname, section);
          const SectionIcon = section.icon;

          if (railMode) {
            const flyoutOpen = flyoutId === section.id;

            return (
              <div
                key={section.id}
                className="relative mb-2"
                onMouseEnter={() => setFlyoutId(section.id)}
                onMouseLeave={() => closeFlyout(section.id)}
                onFocusCapture={() => setFlyoutId(section.id)}
                onBlurCapture={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;
                  if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                    closeFlyout(section.id);
                  }
                }}
              >
                <button
                  type="button"
                  className={`relative flex w-full items-center justify-center rounded-2xl px-3 py-3 transition-colors ${
                    active ? "bg-sidebar-active text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-expanded={flyoutOpen}
                  aria-label={section.label}
                  title={section.label}
                  onClick={() => setFlyoutId(section.id)}
                  data-guide={`shell.sidenav.group.${section.id}`}
                >
                  {active ? <span className="absolute bottom-2 left-1 top-2 w-1 rounded bg-accent" /> : null}
                  <SectionIcon className="h-5 w-5 shrink-0" />
                </button>

                {flyoutOpen ? (
                  <div className="absolute left-full top-0 z-50 ml-3 w-80 rounded-3xl border border-white/10 bg-[#0f1426] p-3 shadow-2xl">
                    <div className="mb-3 flex items-center gap-2 px-1">
                      <SectionIcon className="h-4 w-4 text-white/70" />
                      <div>
                        <div className="text-sm font-semibold text-white">{section.label}</div>
                        <div className="text-xs text-white/60">Quick access while the rail is collapsed.</div>
                      </div>
                    </div>
                    {renderSectionItems(section, { flyout: true })}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <div key={section.id} className="mb-4">
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active ? "bg-white/5 text-white" : "text-white/60 hover:bg-white/5"
                }`}
                aria-expanded={open}
                onClick={() => toggleSection(section.id)}
                data-guide={`shell.sidenav.group.${section.id}`}
              >
                <span className="flex items-center gap-2">
                  <SectionIcon className="h-4 w-4 shrink-0" />
                  {section.label}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open ? renderSectionItems(section) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <details className="group relative">
          <summary
            className={`flex cursor-pointer list-none items-center rounded-2xl hover:bg-white/5 [&::-webkit-details-marker]:hidden ${
              railMode ? "justify-center px-2 py-2" : "gap-3 px-2 py-2"
            }`}
          >
            <Image
              src={userProfile.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-white/10"
              unoptimized
            />
            {!railMode ? (
              <>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {userProfile.firstName} {userProfile.lastName}
                  </div>
                  <div className="truncate text-xs text-white/60">{org.name}</div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-white/60 transition-transform group-open:rotate-180" />
              </>
            ) : null}
          </summary>

          <div
            className={`absolute z-50 rounded-2xl border border-white/10 bg-[#0f1426] p-2 shadow-2xl ${
              railMode ? "bottom-0 left-full ml-3 w-56" : "bottom-full left-0 right-0 mb-2"
            }`}
          >
            <div className="border-b border-white/10 px-2 py-2">
              <div className="text-sm font-medium text-white">
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="text-xs text-white/60">{org.name}</div>
            </div>
            <div className="mt-2 space-y-1">
              {sidebarAccountLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => onNavigate?.()}
                    className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-sidebar-fg transition-colors hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-white/70" />
                    {link.label}
                  </Link>
                );
              })}
              <button
                type="button"
                disabled
                className="w-full rounded-xl px-2 py-2 text-left text-sm text-white/50"
              >
                Sign out (demo)
              </button>
            </div>
          </div>
        </details>
      </div>
    </aside>
  );
}
