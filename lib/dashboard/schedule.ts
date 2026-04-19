import type { DashboardScheduleItem, DashboardScheduleSeed } from "@/lib/fixtures/types";

function startOfLocalDay(baseDate: Date) {
  const localDay = new Date(baseDate);
  localDay.setHours(0, 0, 0, 0);
  return localDay;
}

function parseClockTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return { hours, minutes };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

export function compareDashboardScheduleItems(a: DashboardScheduleItem, b: DashboardScheduleItem) {
  const diff = new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
  if (diff !== 0) return diff;
  return a.title.localeCompare(b.title);
}

export function resolveDashboardScheduleSeeds(
  seeds: DashboardScheduleSeed[],
  baseDate = new Date(),
): DashboardScheduleItem[] {
  const localDay = startOfLocalDay(baseDate);

  return seeds
    .map((seed) => {
      const start = new Date(localDay);
      start.setDate(start.getDate() + seed.dayOffset);
      const startClock = parseClockTime(seed.startTime);
      start.setHours(startClock.hours, startClock.minutes, 0, 0);

      const end = new Date(localDay);
      end.setDate(end.getDate() + seed.dayOffset);
      const endClock = parseClockTime(seed.endTime);
      end.setHours(endClock.hours, endClock.minutes, 0, 0);

      return {
        id: seed.id,
        title: seed.title,
        kind: seed.kind,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        leadId: seed.leadId,
        notes: seed.notes,
        status: seed.status,
      };
    })
    .sort(compareDashboardScheduleItems);
}

export function mergeDashboardSchedule(
  baseItems: DashboardScheduleItem[],
  overrides: Record<string, DashboardScheduleItem>,
) {
  return baseItems.map((item) => overrides[item.id] ?? item).sort(compareDashboardScheduleItems);
}

export function upsertDashboardScheduleItem(
  items: DashboardScheduleItem[],
  nextItem: DashboardScheduleItem,
) {
  return [...items.filter((item) => item.id !== nextItem.id), nextItem].sort(compareDashboardScheduleItems);
}

export function isSameLocalDay(iso: string, date: Date) {
  const itemDate = new Date(iso);
  return (
    itemDate.getFullYear() === date.getFullYear() &&
    itemDate.getMonth() === date.getMonth() &&
    itemDate.getDate() === date.getDate()
  );
}

export function formatScheduleTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatScheduleDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function formatScheduleRange(startAt: string, endAt: string) {
  return `${formatScheduleTime(startAt)} - ${formatScheduleTime(endAt)}`;
}

export function getLocalDateInputValue(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getLocalTimeInputValue(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function combineLocalDateAndTime(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return isValidDate(date) ? date.toISOString() : null;
}
