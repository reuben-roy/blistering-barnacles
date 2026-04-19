import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Building2,
  DollarSign,
  Download,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Phone,
  PlugZap,
  Route,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Tags,
  TrendingUp,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";

export type NavBadge = "NEW";

type NavEntryBase = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: NavBadge;
};

export type NavLink = NavEntryBase & {
  type: "link";
  href: string;
};

export type NavNestedGroup = NavEntryBase & {
  type: "group";
  items: NavLink[];
};

export type NavSectionItem = NavLink | NavNestedGroup;

export type NavSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavSectionItem[];
};

export const navSections: NavSection[] = [
  {
    id: "daily-work",
    label: "Daily Work",
    icon: Home,
    items: [
      { id: "dashboard", type: "link", label: "Dashboard", href: "/app", icon: LayoutDashboard },
      { id: "crm", type: "link", label: "CRM", href: "/app/crm", icon: Users },
      {
        id: "communication",
        type: "group",
        label: "Communication",
        icon: MessageSquare,
        items: [
          { id: "inbox", type: "link", label: "Inbox", href: "/app/communication/inbox", icon: Inbox },
          {
            id: "texting",
            type: "link",
            label: "Texting",
            href: "/app/communication/texting",
            icon: MessageSquare,
          },
          { id: "calling", type: "link", label: "Calling", href: "/app/communication/calling", icon: Phone },
        ],
      },
      { id: "sales", type: "link", label: "Sales", href: "/app/sales", icon: DollarSign },
      {
        id: "transactions",
        type: "group",
        label: "Transactions",
        icon: FolderOpen,
        items: [
          {
            id: "tx-roles",
            type: "link",
            label: "Transaction Roles",
            href: "/app/transactions/roles",
            icon: Users,
          },
          {
            id: "tx-checklists",
            type: "link",
            label: "Checklist Templates",
            href: "/app/transactions/checklists",
            icon: FileText,
          },
          {
            id: "tx-docs",
            type: "link",
            label: "Document Templates",
            href: "/app/transactions/documents",
            icon: FileText,
          },
        ],
      },
      { id: "reporting", type: "link", label: "Reporting", href: "/app/reporting", icon: BarChart3 },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    items: [
      { id: "marketing", type: "link", label: "Marketing", href: "/app/marketing", icon: Megaphone },
      { id: "content", type: "link", label: "Content", href: "/app/content", icon: FileText },
      { id: "automation", type: "link", label: "Automation", href: "/app/automation", icon: Workflow },
      {
        id: "ai",
        type: "group",
        label: "AI Copilots",
        icon: Sparkles,
        items: [
          { id: "ai-overview", type: "link", label: "Overview", href: "/app/ai/overview", icon: Sparkles },
          { id: "ai-assistant", type: "link", label: "AI Assistant", href: "/app/ai/assistant", icon: Sparkles },
          { id: "ai-sales", type: "link", label: "Sales Agent", href: "/app/ai/sales-agent", icon: Sparkles },
          { id: "ai-social", type: "link", label: "Social Agent", href: "/app/ai/social-agent", icon: Sparkles },
        ],
      },
      { id: "marketplace", type: "link", label: "Marketplace", href: "/app/marketplace", icon: ShoppingBag },
    ],
  },
  {
    id: "setup",
    label: "Setup",
    icon: Settings,
    items: [
      {
        id: "lead-settings",
        type: "group",
        label: "Lead Settings",
        icon: Route,
        items: [
          { id: "lead-capture", type: "link", label: "Lead Capture", href: "/app/lead-settings/capture", icon: Route },
          { id: "lead-routing", type: "link", label: "Lead Routing", href: "/app/lead-settings/routing", icon: Route },
          { id: "tags", type: "link", label: "Tags", href: "/app/lead-settings/tags", icon: Tags },
          { id: "lead-import", type: "link", label: "Lead Import", href: "/app/lead-settings/import", icon: Download },
        ],
      },
      { id: "integrations", type: "link", label: "Integrations", href: "/app/settings/integrations", icon: PlugZap },
      {
        id: "organization",
        type: "link",
        label: "My Organization",
        href: "/app/settings/organization",
        icon: Building2,
      },
      { id: "vendor", type: "link", label: "Vendor / Partner", href: "/app/settings/vendor", icon: Building2 },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: UserRound,
    items: [
      { id: "profile", type: "link", label: "Profile", href: "/app/settings/profile", icon: UserRound },
      {
        id: "account-security",
        type: "link",
        label: "Account & Security",
        href: "/app/settings/account",
        icon: Shield,
        badge: "NEW",
      },
      {
        id: "notifications",
        type: "link",
        label: "Notifications",
        href: "/app/settings/notifications",
        icon: Bell,
      },
      {
        id: "reporting-personal",
        type: "link",
        label: "Personal Reporting",
        href: "/app/settings/reporting",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    items: [{ id: "help", type: "link", label: "Learning Hub", href: "/app/help", icon: HelpCircle }],
  },
];

export const sidebarAccountLinks: NavLink[] = [
  { id: "profile", type: "link", label: "Profile", href: "/app/settings/profile", icon: UserRound },
  { id: "account-security", type: "link", label: "Settings", href: "/app/settings/account", icon: Shield },
];

export function isNavLink(item: NavSectionItem): item is NavLink {
  return item.type === "link";
}

export function isNavNestedGroup(item: NavSectionItem): item is NavNestedGroup {
  return item.type === "group";
}

export function flattenSectionLinks(section: NavSection) {
  return section.items.flatMap((item) => (item.type === "group" ? item.items : [item]));
}
