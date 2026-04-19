"use client";

const GROUPS_KEY = "nav.groups.v1";
const COLLAPSED_KEY = "nav.collapsed.v1";

export type NavGroupState = Record<string, boolean>;

export function readNavGroupState(): NavGroupState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GROUPS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NavGroupState;
  } catch {
    return {};
  }
}

export function writeNavGroupState(state: NavGroupState) {
  window.localStorage.setItem(GROUPS_KEY, JSON.stringify(state));
}

export function setNavGroupOpen(groupId: string, open: boolean) {
  const s = readNavGroupState();
  s[groupId] = open;
  writeNavGroupState(s);
}

export function readNavCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setNavCollapsed(collapsed: boolean) {
  window.localStorage.setItem(COLLAPSED_KEY, String(collapsed));
}
