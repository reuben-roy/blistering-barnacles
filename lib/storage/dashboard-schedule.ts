"use client";

import type { DashboardScheduleItem, DashboardScheduleKind, DashboardScheduleStatus } from "@/lib/fixtures/types";

const KEY = "dashboard.schedule.v1";

const scheduleKinds: DashboardScheduleKind[] = ["task", "meeting", "appointment"];
const scheduleStatuses: DashboardScheduleStatus[] = ["pending", "scheduled", "completed"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isDashboardScheduleItem(value: unknown): value is DashboardScheduleItem {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string") return false;
  if (typeof value.title !== "string") return false;
  if (typeof value.startAt !== "string") return false;
  if (typeof value.endAt !== "string") return false;
  if (!scheduleKinds.includes(value.kind as DashboardScheduleKind)) return false;
  if (value.leadId !== undefined && typeof value.leadId !== "string") return false;
  if (value.notes !== undefined && typeof value.notes !== "string") return false;
  if (
    value.status !== undefined &&
    !scheduleStatuses.includes(value.status as DashboardScheduleStatus)
  ) {
    return false;
  }
  return true;
}

export function readDashboardScheduleItems(): Record<string, DashboardScheduleItem> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return {};

    const items: Record<string, DashboardScheduleItem> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isDashboardScheduleItem(value)) {
        items[key] = value;
      }
    }
    return items;
  } catch {
    return {};
  }
}

export function writeDashboardScheduleItem(item: DashboardScheduleItem) {
  const items = readDashboardScheduleItems();
  items[item.id] = item;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}
