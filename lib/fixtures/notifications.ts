import type { NotificationItem } from "./types";

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New lead from IDX: Jordan Ellis",
    at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unread: true,
  },
  {
    id: "n2",
    title: "Showing confirmed for 2210 W Elm St",
    at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: true,
  },
  {
    id: "n3",
    title: "Task due: follow up with Priya Shah",
    at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unread: true,
  },
  {
    id: "n4",
    title: "Document uploaded to transaction #4821",
    at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    unread: false,
  },
  {
    id: "n5",
    title: "Weekly pipeline digest is ready",
    at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    unread: false,
  },
  {
    id: "n6",
    title: "Integration sync completed (calendar)",
    at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    unread: false,
  },
];
