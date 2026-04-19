"use client";

const KEY = "nav.groups.v1";

export type NavGroupState = Record<string, boolean>;

export function readNavGroupState(): NavGroupState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NavGroupState;
  } catch {
    return {};
  }
}

export function writeNavGroupState(state: NavGroupState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function setNavGroupOpen(groupId: string, open: boolean) {
  const s = readNavGroupState();
  s[groupId] = open;
  writeNavGroupState(s);
}
