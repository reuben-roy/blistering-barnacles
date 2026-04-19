import type { DashboardTask } from "./types";

export const dashboardTasks: DashboardTask[] = [
  {
    id: "t1",
    label: "Call back on pre-approval question",
    dueTime: "9:30 AM",
    leadId: "lead-3",
  },
  {
    id: "t2",
    label: "Send CMA for north Scottsdale comp set",
    dueTime: "11:00 AM",
    leadId: "lead-7",
  },
  {
    id: "t3",
    label: "Confirm photographer for new listing",
    dueTime: "1:15 PM",
  },
  {
    id: "t4",
    label: "Update checklist: HOA docs received",
    dueTime: "2:00 PM",
  },
  {
    id: "t5",
    label: "Text seller reminder for disclosure signatures",
    dueTime: "4:30 PM",
    leadId: "lead-12",
  },
];
