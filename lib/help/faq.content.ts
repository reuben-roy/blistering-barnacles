export type FaqCategory =
  | "Billing"
  | "Leads"
  | "Compliance"
  | "AI"
  | "Integrations"
  | "GettingStarted";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answerMd: string;
  relatedLinks?: { label: string; href: string }[];
  snippet?: { label: string; text: string };
};

export const faqItems: FaqItem[] = [
  {
    id: "invite-teammates",
    category: "GettingStarted",
    question: "How do I invite teammates to my workspace?",
    answerMd:
      "Open **My Organization**, choose **Members**, then **Invite**. Enter email and role. This demo does not send email.",
    relatedLinks: [{ label: "Open organization settings", href: "/app/settings/organization" }],
  },
  {
    id: "import-leads",
    category: "GettingStarted",
    question: "What is the safest way to import leads for the first time?",
    answerMd:
      "Use **Lead Import** with a CSV template. Map email and phone columns, then review duplicates before committing. Practice on a small file first.",
    relatedLinks: [{ label: "Lead Import", href: "/app/lead-settings/import" }],
  },
  {
    id: "connect-calendar",
    category: "Integrations",
    question: "How do I connect a calendar for appointments?",
    answerMd:
      "Go to **Integrations** and choose your calendar provider. Approve access, then confirm your default availability in **Profile** working hours.",
    relatedLinks: [
      { label: "Integrations", href: "/app/settings/integrations" },
      { label: "Profile", href: "/app/settings/profile" },
    ],
  },
  {
    id: "lead-routing-basics",
    category: "Leads",
    question: "How do lead routing rules decide who gets a new lead?",
    answerMd:
      "Rules evaluate source, geography, price band, and round-robin pools. Put your highest-intent sources first so they are not caught by broad catch-all rules.",
    relatedLinks: [{ label: "Lead Routing", href: "/app/lead-settings/routing" }],
  },
  {
    id: "duplicate-leads",
    category: "Leads",
    question: "What should I do if I see duplicate contacts?",
    answerMd:
      "Merge duplicates when the same person used two emails. Keep the record with the strongest consent trail and attach notes from the merged record.",
  },
  {
    id: "tags-best-practices",
    category: "Leads",
    question: "How should we use tags without creating clutter?",
    answerMd:
      "Limit tags to operational categories like **Investor** or **Relocation**. Avoid one-off tags; use notes for one-time context.",
    relatedLinks: [{ label: "Tags", href: "/app/lead-settings/tags" }],
  },
  {
    id: "tcpa-consent",
    category: "Compliance",
    question: "What is consent status and why does it matter for texting?",
    answerMd:
      "This content is **demo-only** and not legal advice. In production, your broker or counsel should define consent workflows. The idea is to store what permission you have before automated outreach.",
    snippet: {
      label: "Example disclosure line (demo only)",
      text: "By submitting, you agree to receive calls and texts about real estate services. Message and data rates may apply. Reply STOP to opt out.",
    },
    relatedLinks: [{ label: "FAQ home", href: "/app/help/faq" }],
  },
  {
    id: "regulated-technology",
    category: "Compliance",
    question: "What is regulated technology in simple terms?",
    answerMd:
      "Demo explanation only. Some dialer or voicemail features can be treated differently under telemarketing rules. Your brokerage compliance officer should classify tools you use.",
  },
  {
    id: "ai-handoff",
    category: "AI",
    question: "When should automated AI messaging hand off to an agent?",
    answerMd:
      "Hand off when the contact requests human help, asks for pricing strategy, or schedules a meeting. Also pause automation if intent signals conflict (for example appraisal dispute).",
    relatedLinks: [{ label: "AI Assistant", href: "/app/ai/assistant" }],
  },
  {
    id: "ai-edit-messages",
    category: "AI",
    question: "Can I edit AI drafts before they go out?",
    answerMd:
      "Yes. Treat drafts like email templates: edit tone, local details, and compliance disclaimers. Keep a personal sign-off when appropriate.",
  },
  {
    id: "billing-seats",
    category: "Billing",
    question: "How are seats counted for billing?",
    answerMd:
      "Demo copy. Seats usually map to active users in the org. Pending invites may or may not count depending on your plan. Verify with your account executive in a real deployment.",
  },
  {
    id: "billing-invoice",
    category: "Billing",
    question: "Where would I download invoices in a real account?",
    answerMd:
      "Typically under **Billing** or **Account**. This scaffold does not include billing screens.",
  },
  {
    id: "integrations-webhooks",
    category: "Integrations",
    question: "What are webhooks used for?",
    answerMd:
      "Webhooks notify another system when something changes, like a new lead or a stage update. Useful for data warehouses and analytics pipelines.",
  },
  {
    id: "lead-capture-forms",
    category: "Leads",
    question: "How do I reduce junk leads from web forms?",
    answerMd:
      "Add simple bot protection, require a real phone, and route unknown sources to a nurture pool instead of an ISA queue.",
    relatedLinks: [{ label: "Lead Capture", href: "/app/lead-settings/capture" }],
  },
  {
    id: "open-house-followup",
    category: "GettingStarted",
    question: "What is a simple open house follow-up workflow?",
    answerMd:
      "Same-day thank you text, next-day market snapshot email, then a call attempt within 48 hours. Tag attendees as **OpenHouse** for reporting.",
  },
  {
    id: "mobile-app-tasks",
    category: "GettingStarted",
    question: "Where do tasks show up for agents in the field?",
    answerMd:
      "Tasks should appear on mobile alongside calls and messages. This web scaffold focuses on desktop layout patterns.",
  },
  {
    id: "ai-sales-agent",
    category: "AI",
    question: "What is a Sales Agent feature in this demo story?",
    answerMd:
      "A guided assistant that proposes follow-ups and call prep from CRM context. Measure impact by appointments set and speed to first contact.",
    relatedLinks: [{ label: "Sales Agent", href: "/app/ai/sales-agent" }],
  },
  {
    id: "social-agent",
    category: "AI",
    question: "What is a Social Agent used for?",
    answerMd:
      "Drafting short social posts from listing facts and local stats. Always review for fair housing language and brokerage branding rules.",
    relatedLinks: [{ label: "Social Agent", href: "/app/ai/social-agent" }],
  },
  {
    id: "transaction-checklists",
    category: "GettingStarted",
    question: "Why use checklist templates for transactions?",
    answerMd:
      "They reduce missed deadlines and create a consistent client experience. Start with broker-provided templates, then customize per market.",
    relatedLinks: [{ label: "Checklist Templates", href: "/app/transactions/checklists" }],
  },
  {
    id: "document-templates",
    category: "GettingStarted",
    question: "Where do document templates help the most?",
    answerMd:
      "Repeated disclosures and vendor notices. Keep templates short and link out to long-form policies when possible.",
    relatedLinks: [{ label: "Document Templates", href: "/app/transactions/documents" }],
  },
  {
    id: "vendor-partner",
    category: "Integrations",
    question: "What is Vendor or Partner access?",
    answerMd:
      "A restricted role for photographers, TCs, or coaches. They see only what you grant. Good for collaboration without exposing all leads.",
    relatedLinks: [{ label: "Vendor / Partner", href: "/app/settings/vendor" }],
  },
];
