export type SocialPlatform =
  | "facebook"
  | "linkedin"
  | "x"
  | "zillow"
  | "yelp"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "pinterest";

export type SocialLink = {
  platform: SocialPlatform;
  connected: boolean;
  handle?: string;
  profileUrl?: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: { country: "US"; e164: string; display: string };
  timeZone: string;
  workingHours: { start: string; end: string };
  licenseId: string;
  position: "Agent" | "Broker" | "TC" | "Admin";
  avatarUrl: string;
  social: SocialLink[];
};

export type Org = {
  id: string;
  name: string;
  officeCity: string;
  seats: number;
  plan: "Starter" | "Growth" | "Enterprise";
};

export type LeadStage = "New" | "Nurture" | "Hot" | "ApptSet" | "Closed" | "Lost";

export type LeadSource =
  | "IDX"
  | "Referral"
  | "OpenHouse"
  | "PaidAds"
  | "Sphere"
  | "ZillowFlex"
  | "Unknown";

export type LeadActivity = {
  id: string;
  at: string;
  type: "call" | "text" | "email" | "note" | "showing" | "system";
  title: string;
  body?: string;
};

export type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  stage: LeadStage;
  source: LeadSource;
  tags: string[];
  assignedTo: string;
  lastActivityAt: string;
  intent: "Buy" | "Sell" | "Both" | "Unknown";
  address?: string;
  priceMin?: number;
  priceMax?: number;
  activities: LeadActivity[];
  notes: { id: string; at: string; text: string }[];
};

export type Transaction = {
  id: string;
  property: string;
  side: "List" | "Buy";
  status: "Prep" | "UnderContract" | "Closing" | "Closed";
  checklist: { id: string; label: string; done: boolean }[];
};

export type NotificationItem = {
  id: string;
  title: string;
  at: string;
  unread: boolean;
};

export type DashboardScheduleKind = "task" | "meeting" | "appointment";

export type DashboardScheduleStatus = "pending" | "scheduled" | "completed";

export type DashboardScheduleSeed = {
  id: string;
  title: string;
  kind: DashboardScheduleKind;
  dayOffset: number;
  startTime: string;
  endTime: string;
  leadId?: string;
  notes?: string;
  status?: DashboardScheduleStatus;
};

export type DashboardScheduleItem = {
  id: string;
  title: string;
  kind: DashboardScheduleKind;
  startAt: string;
  endAt: string;
  leadId?: string;
  notes?: string;
  status?: DashboardScheduleStatus;
};
