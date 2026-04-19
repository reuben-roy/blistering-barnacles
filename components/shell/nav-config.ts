export type NavBadge = "NEW";

export type NavLeaf = {
  id: string;
  label: string;
  href: string;
  badge?: NavBadge;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavLeaf[];
};

export const navGroups: NavGroup[] = [
  {
    id: "user-settings",
    label: "My User Settings",
    items: [
      { id: "profile", label: "Profile", href: "/app/settings/profile" },
      { id: "account", label: "Account & Security", href: "/app/settings/account", badge: "NEW" },
      { id: "notifications", label: "Notifications", href: "/app/settings/notifications" },
      { id: "integrations", label: "Integrations", href: "/app/settings/integrations" },
      { id: "organization", label: "My Organization", href: "/app/settings/organization" },
      { id: "vendor", label: "Vendor / Partner", href: "/app/settings/vendor" },
      { id: "reporting-personal", label: "Reporting", href: "/app/settings/reporting" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      { id: "inbox", label: "Inbox", href: "/app/communication/inbox" },
      { id: "texting", label: "Texting", href: "/app/communication/texting" },
      { id: "calling", label: "Calling", href: "/app/communication/calling" },
    ],
  },
  {
    id: "lofty-ai",
    label: "BrokerDesk AI",
    items: [
      { id: "ai-overview", label: "Overview", href: "/app/ai/overview" },
      { id: "ai-assistant", label: "AI Assistant", href: "/app/ai/assistant" },
      { id: "ai-sales", label: "Sales Agent", href: "/app/ai/sales-agent" },
      { id: "ai-social", label: "Social Agent", href: "/app/ai/social-agent" },
    ],
  },
  {
    id: "lead-settings",
    label: "Lead Settings",
    items: [
      { id: "lead-capture", label: "Lead Capture", href: "/app/lead-settings/capture" },
      { id: "lead-routing", label: "Lead Routing", href: "/app/lead-settings/routing" },
      { id: "tags", label: "Tags", href: "/app/lead-settings/tags" },
      { id: "lead-import", label: "Lead Import", href: "/app/lead-settings/import" },
    ],
  },
  {
    id: "transactions",
    label: "Transactions",
    items: [
      { id: "tx-roles", label: "Transaction Roles", href: "/app/transactions/roles" },
      { id: "tx-checklists", label: "Checklist Templates", href: "/app/transactions/checklists" },
      { id: "tx-docs", label: "Document Templates", href: "/app/transactions/documents" },
    ],
  },
];
