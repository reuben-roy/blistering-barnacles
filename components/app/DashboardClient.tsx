"use client";

import type { EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import {
  combineLocalDateAndTime,
  formatScheduleDate,
  formatScheduleRange,
  formatScheduleTime,
  getLocalDateInputValue,
  getLocalTimeInputValue,
  isSameLocalDay,
  mergeDashboardSchedule,
  resolveDashboardScheduleSeeds,
  upsertDashboardScheduleItem,
} from "@/lib/dashboard/schedule";
import { dashboardScheduleSeeds } from "@/lib/fixtures/tasks";
import type {
  DashboardScheduleItem,
  DashboardScheduleKind,
  DashboardScheduleStatus,
  Lead,
  LeadStage,
} from "@/lib/fixtures/types";
import { formatRelativeTime } from "@/lib/format";
import {
  readDashboardScheduleItems,
  writeDashboardScheduleItem,
} from "@/lib/storage/dashboard-schedule";

type DashboardLeadRow = Pick<Lead, "id" | "fullName" | "stage" | "lastActivityAt">;

type ScheduleDraft = {
  id: string;
  title: string;
  kind: DashboardScheduleKind;
  status: DashboardScheduleStatus;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  notes: string;
  leadId?: string;
};

const kindLabels: Record<DashboardScheduleKind, string> = {
  task: "Task",
  meeting: "Meeting",
  appointment: "Appointment",
};

const statusLabels: Record<DashboardScheduleStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Completed",
};

const statusOptions: DashboardScheduleStatus[] = ["pending", "scheduled", "completed"];
const kindOptions: DashboardScheduleKind[] = ["task", "meeting", "appointment"];

function calendarColors(kind: DashboardScheduleKind) {
  if (kind === "meeting") {
    return { backgroundColor: "#fef3c7", borderColor: "#f59e0b", textColor: "#78350f" };
  }
  if (kind === "appointment") {
    return { backgroundColor: "#dcfce7", borderColor: "#16a34a", textColor: "#14532d" };
  }
  return { backgroundColor: "#dbeafe", borderColor: "#2563eb", textColor: "#1e3a8a" };
}

function kindBadgeClassName(kind: DashboardScheduleKind) {
  if (kind === "meeting") return "border-amber-200 bg-amber-50 text-amber-800";
  if (kind === "appointment") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  return "border-blue-100 bg-blue-50 text-accent";
}

function statusTone(status: DashboardScheduleStatus): "neutral" | "accent" | "danger" {
  if (status === "completed") return "accent";
  if (status === "pending") return "danger";
  return "neutral";
}

function buildDraft(item: DashboardScheduleItem): ScheduleDraft {
  return {
    id: item.id,
    title: item.title,
    kind: item.kind,
    status: item.status ?? "pending",
    startDate: getLocalDateInputValue(item.startAt),
    startTime: getLocalTimeInputValue(item.startAt),
    endDate: getLocalDateInputValue(item.endAt),
    endTime: getLocalTimeInputValue(item.endAt),
    notes: item.notes ?? "",
    leadId: item.leadId,
  };
}

export function DashboardClient({
  counts,
  recentLeads,
  aiSummary,
  children,
}: {
  counts: Record<LeadStage, number>;
  recentLeads: DashboardLeadRow[];
  aiSummary: string;
  children?: ReactNode;
}) {
  const [items, setItems] = useState<DashboardScheduleItem[] | null>(null);
  const [draft, setDraft] = useState<ScheduleDraft | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const baseItems = resolveDashboardScheduleSeeds(dashboardScheduleSeeds, new Date());
    const overrides = readDashboardScheduleItems();
    setItems(mergeDashboardSchedule(baseItems, overrides));
  }, []);

  useEffect(() => {
    if (!draft) return undefined;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDraft(null);
        setError("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draft]);

  const today = new Date();
  const todayTasks =
    items?.filter((item) => item.kind === "task" && isSameLocalDay(item.startAt, today)) ?? [];

  const calendarEvents: EventInput[] =
    items?.map((item) => ({
      id: item.id,
      title: item.title,
      start: item.startAt,
      end: item.endAt,
      ...calendarColors(item.kind),
      extendedProps: {
        kind: item.kind,
        status: item.status ?? "pending",
      },
    })) ?? [];

  function openEditor(itemId: string) {
    const item = items?.find((entry) => entry.id === itemId);
    if (!item) return;
    setDraft(buildDraft(item));
    setError("");
  }

  function closeEditor() {
    setDraft(null);
    setError("");
  }

  function saveDraft() {
    if (!draft || !items) return;

    const startAt = combineLocalDateAndTime(draft.startDate, draft.startTime);
    const endAt = combineLocalDateAndTime(draft.endDate, draft.endTime);

    if (!startAt || !endAt) {
      setError("Choose a valid start and end date/time.");
      return;
    }

    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      setError("End time must be after the start time.");
      return;
    }

    const current = items.find((item) => item.id === draft.id);
    if (!current) return;

    const nextItem: DashboardScheduleItem = {
      ...current,
      title: draft.title.trim() || current.title,
      kind: draft.kind,
      status: draft.status,
      startAt,
      endAt,
      notes: draft.notes.trim() || undefined,
    };

    setItems(upsertDashboardScheduleItem(items, nextItem));
    writeDashboardScheduleItem(nextItem);
    closeEditor();
  }

  function renderEventContent(arg: EventContentArg) {
    const kind = arg.event.extendedProps.kind as DashboardScheduleKind;
    return (
      <div className="space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{kindLabels[kind]}</div>
        <div className="text-xs font-semibold leading-tight">{arg.event.title}</div>
      </div>
    );
  }

  function onSelectEvent(arg: EventClickArg) {
    openEditor(arg.event.id);
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">
        <Card className="dashboard-calendar p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-text">Schedule</div>
            <p className="mt-1 text-sm text-muted">
              Defaulting to the next 3 days so tasks, meetings, and appointments are easy to scan.
            </p>
          </div>

          {items ? (
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridThreeDay"
              views={{
                timeGridThreeDay: {
                  type: "timeGrid",
                  duration: { days: 3 },
                  buttonText: "3 days",
                },
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridThreeDay,timeGridWeek,dayGridMonth",
              }}
              buttonText={{
                today: "Today",
                timeGridWeek: "Week",
                dayGridMonth: "Month",
              }}
              events={calendarEvents}
              eventClick={onSelectEvent}
              eventContent={renderEventContent}
              allDaySlot={false}
              nowIndicator
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              eventTimeFormat={{ hour: "numeric", minute: "2-digit" }}
              dayHeaderFormat={{ weekday: "short", month: "numeric", day: "numeric" }}
            />
          ) : (
            <div className="h-[720px] rounded-lg bg-app-bg animate-pulse" />
          )}
        </Card>

        <div className="space-y-4">
          {children}

          <Card>
            <div className="text-sm font-semibold">Pipeline</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(counts) as (keyof typeof counts)[]).map((key) => (
                <Badge key={key} tone={key === "Hot" || key === "ApptSet" ? "accent" : "neutral"}>
                  {key}: {counts[key]}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold">AI summary (demo text)</div>
            <p className="mt-3 text-sm text-muted">{aiSummary}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Today&apos;s tasks</div>
              <Badge tone="neutral">{todayTasks.length}</Badge>
            </div>

            {items ? (
              todayTasks.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {todayTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0"
                    >
                      <div>
                        <button
                          type="button"
                          className="text-left font-medium text-text hover:text-accent"
                          onClick={() => openEditor(task.id)}
                        >
                          {task.title}
                        </button>
                        <div className="mt-1 text-xs text-muted">Due {formatScheduleTime(task.startAt)}</div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge tone={statusTone(task.status ?? "pending")}>
                          {statusLabels[task.status ?? "pending"]}
                        </Badge>
                        {task.leadId ? (
                          <Link
                            className="text-xs text-accent hover:underline"
                            href={`/app/crm/leads/${task.leadId}`}
                          >
                            Open lead
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="text-xs text-accent hover:underline"
                            onClick={() => openEditor(task.id)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No tasks scheduled for today.</p>
              )
            ) : (
              <p className="mt-3 text-sm text-muted">Loading schedule...</p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Recent leads</div>
              <Link className="text-sm text-accent hover:underline" href="/app/crm">
                View all
              </Link>
            </div>
            <div className="mt-3">
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Stage</Th>
                    <Th>Last activity</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <Td>
                        <Link className="font-medium text-accent hover:underline" href={`/app/crm/leads/${lead.id}`}>
                          {lead.fullName}
                        </Link>
                      </Td>
                      <Td>
                        <Badge>{lead.stage}</Badge>
                      </Td>
                      <Td className="text-muted">{formatRelativeTime(lead.lastActivityAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close schedule editor"
            onClick={closeEditor}
          />

          <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-auto rounded-lg border border-border bg-surface p-5 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-text">Edit calendar item</div>
                <p className="mt-1 text-sm text-muted">
                  Update the timing, type, and any extra notes or conditions for this item.
                </p>
              </div>
              <Badge className={kindBadgeClassName(draft.kind)}>{kindLabels[draft.kind]}</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Title"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </div>

              <Select
                label="Type"
                value={draft.kind}
                onChange={(event) =>
                  setDraft({ ...draft, kind: event.target.value as DashboardScheduleKind })
                }
              >
                {kindOptions.map((kind) => (
                  <option key={kind} value={kind}>
                    {kindLabels[kind]}
                  </option>
                ))}
              </Select>

              <Select
                label="Status"
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as DashboardScheduleStatus })
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </Select>

              <Input
                label="Start date"
                type="date"
                value={draft.startDate}
                onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
              />
              <Input
                label="Start time"
                type="time"
                value={draft.startTime}
                onChange={(event) => setDraft({ ...draft, startTime: event.target.value })}
              />
              <Input
                label="End date"
                type="date"
                value={draft.endDate}
                onChange={(event) => setDraft({ ...draft, endDate: event.target.value })}
              />
              <Input
                label="End time"
                type="time"
                value={draft.endTime}
                onChange={(event) => setDraft({ ...draft, endTime: event.target.value })}
              />

              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block text-muted">Notes or conditions</span>
                <textarea
                  className="min-h-28 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent"
                  value={draft.notes}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                />
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-app-bg px-3 py-2 text-sm text-muted">
              {formatScheduleDate(
                combineLocalDateAndTime(draft.startDate, draft.startTime) ?? new Date().toISOString(),
              )}
              {" · "}
              {formatScheduleRange(
                combineLocalDateAndTime(draft.startDate, draft.startTime) ?? new Date().toISOString(),
                combineLocalDateAndTime(draft.endDate, draft.endTime) ?? new Date().toISOString(),
              )}
            </div>

            {error ? <div className="mt-3 text-sm text-danger">{error}</div> : null}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {draft.leadId ? (
                <Link className="text-sm text-accent hover:underline" href={`/app/crm/leads/${draft.leadId}`}>
                  Open lead
                </Link>
              ) : (
                <span className="text-sm text-muted">Dashboard-only item</span>
              )}

              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={closeEditor}>
                  Cancel
                </Button>
                <Button onClick={saveDraft}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
