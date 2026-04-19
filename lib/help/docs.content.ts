import rawDocs from "./docs.raw.json";

type RawDocRow = {
  url: string;
  text: string;
};

export type DocTopic =
  | "getting-started"
  | "crm"
  | "communication"
  | "ai"
  | "integrations"
  | "transactions"
  | "website-marketing"
  | "reporting"
  | "account-admin"
  | "mobile"
  | "whats-new"
  | "other";

export type HelpDoc = {
  id: string;
  title: string;
  url: string;
  sourceSection?: string;
  topic: DocTopic;
  slug: string;
};

type TopicRule = {
  topic: DocTopic;
  patterns: RegExp[];
};

type HelpPreset = {
  keywords: string[];
  preferredTopics?: DocTopic[];
};

export const docTopicOrder: DocTopic[] = [
  "getting-started",
  "crm",
  "communication",
  "ai",
  "integrations",
  "transactions",
  "website-marketing",
  "reporting",
  "account-admin",
  "mobile",
  "whats-new",
  "other",
];

export const docTopicLabels: Record<DocTopic, string> = {
  "getting-started": "Getting started",
  crm: "CRM",
  communication: "Communication",
  ai: "AI",
  integrations: "Integrations",
  transactions: "Transactions",
  "website-marketing": "Website & marketing",
  reporting: "Reporting",
  "account-admin": "Account & admin",
  mobile: "Mobile",
  "whats-new": "What's new",
  other: "Other",
};

const topicOverrides: Record<string, DocTopic> = {
  "48574168766235": "getting-started",
  "48475807532699": "getting-started",
  "46182047758235": "getting-started",
  "360054524632": "getting-started",
  "360054969331": "getting-started",
  "7134172721691": "account-admin",
  "10385541670427": "account-admin",
  "360054865592": "integrations",
};

const topicRules: TopicRule[] = [
  {
    topic: "whats-new",
    patterns: [/\bwhat'?s new\b/i, /\brelease\b/i, /\bretired\b/i, /\bnew feature\b/i],
  },
  {
    topic: "mobile",
    patterns: [/\bmobile\b/i, /\bios\b/i, /\bandroid\b/i, /\blofty app\b/i],
  },
  {
    topic: "ai",
    patterns: [
      /\bai\b/i,
      /\bcopilot/i,
      /\bassistant\b/i,
      /\bsales agent\b/i,
      /\bsocial agent\b/i,
      /\bhomeowner agent\b/i,
      /\bplaybook\b/i,
      /\bsmart leads\b/i,
      /\bvirtual number\b/i,
    ],
  },
  {
    topic: "integrations",
    patterns: [
      /\bintegration\b/i,
      /\bintegrations\b/i,
      /\bcalendar\b/i,
      /\bwebhook\b/i,
      /\bapi nation\b/i,
      /\bsearch console\b/i,
      /\bgoogle analytics\b/i,
      /\bfacebook pixel\b/i,
      /\bbombbomb\b/i,
      /\bcanva\b/i,
      /\bbrokermint\b/i,
      /\baidentified\b/i,
      /\bcloudcma\b/i,
      /\badwerx\b/i,
      /\bcalendly\b/i,
    ],
  },
  {
    topic: "transactions",
    patterns: [/\btransaction\b/i, /\bdocument templates?\b/i, /\bchecklists?\b/i, /\bcoordinator\b/i],
  },
  {
    topic: "account-admin",
    patterns: [
      /\bbilling\b/i,
      /\baccount\b/i,
      /\bsecurity\b/i,
      /\bpermissions?\b/i,
      /\bteam management\b/i,
      /\boffice\b/i,
      /\bseats?\b/i,
      /\bsso\b/i,
      /\btax\b/i,
      /\bach\b/i,
      /\bmembers\b/i,
      /\bowner\/admin\b/i,
      /\bimport agents\b/i,
    ],
  },
  {
    topic: "website-marketing",
    patterns: [
      /\bwebsite\b/i,
      /\bidx\b/i,
      /\bseo\b/i,
      /\blanding page\b/i,
      /\bblog\b/i,
      /\bdomain\b/i,
      /\blisting\b/i,
      /\bproperty\b/i,
      /\bmarket report\b/i,
      /\bmarket snapshot\b/i,
      /\bfeatured area\b/i,
      /\bmailers?\b/i,
      /\bpostcard\b/i,
      /\bsocial studio\b/i,
      /\bcustomization\b/i,
      /\bmeta tags?\b/i,
      /\bopen house forms?\b/i,
      /\bshowing\b/i,
    ],
  },
  {
    topic: "reporting",
    patterns: [/\breporting\b/i, /\banalytics\b/i, /\baccountability\b/i, /\busage\b/i],
  },
  {
    topic: "communication",
    patterns: [
      /\btext\b/i,
      /\bsms\b/i,
      /\bcall\b/i,
      /\bphone\b/i,
      /\binbox\b/i,
      /\bemail\b/i,
      /\bvoicemail\b/i,
      /\bgroup texting\b/i,
      /\bcall scripts\b/i,
      /\bcall list\b/i,
    ],
  },
  {
    topic: "crm",
    patterns: [
      /\blead\b/i,
      /\bcrm\b/i,
      /\bcontact\b/i,
      /\bdashboard\b/i,
      /\bpipeline\b/i,
      /\bsegments?\b/i,
      /\bsources?\b/i,
      /\btags?\b/i,
      /\brouting\b/i,
      /\bimport\b/i,
      /\bconsent\b/i,
      /\bdisclaimer\b/i,
      /\bfilters?\b/i,
      /\bstages?\b/i,
    ],
  },
  {
    topic: "getting-started",
    patterns: [
      /\bgetting started\b/i,
      /\bsetup\b/i,
      /\btraining guide\b/i,
      /\bintroduction\b/i,
      /\bvideos and tutorials\b/i,
      /\buser transfer\b/i,
    ],
  },
];

export const helpPresets = {
  dashboard: {
    keywords: ["dashboard", "pipeline", "lead"],
    preferredTopics: ["crm", "reporting"],
  },
  crm: {
    keywords: ["crm", "lead", "contact", "pipeline"],
    preferredTopics: ["crm", "communication"],
  },
  "crm-lead": {
    keywords: ["lead", "contact", "activity", "notes"],
    preferredTopics: ["crm", "communication"],
  },
  profile: {
    keywords: ["profile", "email signature", "working hours"],
    preferredTopics: ["getting-started", "account-admin"],
  },
  notifications: {
    keywords: ["notifications", "alerts", "email"],
    preferredTopics: ["communication", "account-admin"],
  },
  account: {
    keywords: ["security", "account", "sso"],
    preferredTopics: ["account-admin"],
  },
  organization: {
    keywords: ["team", "office", "agents"],
    preferredTopics: ["account-admin", "getting-started"],
  },
  vendor: {
    keywords: ["vendor", "partner", "access"],
    preferredTopics: ["account-admin", "transactions"],
  },
  integrations: {
    keywords: ["integration", "calendar", "webhook"],
    preferredTopics: ["integrations"],
  },
  "lead-capture": {
    keywords: ["capture", "forms", "lead"],
    preferredTopics: ["crm", "website-marketing"],
  },
  "lead-routing": {
    keywords: ["routing", "round robin"],
    preferredTopics: ["crm"],
  },
  tags: {
    keywords: ["tags", "segments"],
    preferredTopics: ["crm"],
  },
  "lead-import": {
    keywords: ["import", "csv", "google contacts"],
    preferredTopics: ["crm"],
  },
  inbox: {
    keywords: ["inbox", "messages", "communication"],
    preferredTopics: ["communication"],
  },
  texting: {
    keywords: ["text", "sms", "templates"],
    preferredTopics: ["communication"],
  },
  calling: {
    keywords: ["call", "phone", "scripts"],
    preferredTopics: ["communication"],
  },
  sales: {
    keywords: ["sales", "pipeline", "appointments"],
    preferredTopics: ["crm", "communication"],
  },
  marketing: {
    keywords: ["marketing", "email", "campaigns"],
    preferredTopics: ["website-marketing", "communication"],
  },
  content: {
    keywords: ["content", "website", "landing page"],
    preferredTopics: ["website-marketing"],
  },
  automation: {
    keywords: ["automation", "smart plan", "workflow"],
    preferredTopics: ["crm", "ai"],
  },
  reporting: {
    keywords: ["reporting", "email accountability"],
    preferredTopics: ["reporting", "crm"],
  },
  marketplace: {
    keywords: ["marketplace", "apps", "services"],
    preferredTopics: ["integrations"],
  },
  ai: {
    keywords: ["ai", "copilots", "assistant"],
    preferredTopics: ["ai"],
  },
  "ai-overview": {
    keywords: ["ai", "copilots", "assistant"],
    preferredTopics: ["ai"],
  },
  "ai-assistant": {
    keywords: ["ai assistant", "multi-step tasks", "smart notifications"],
    preferredTopics: ["ai"],
  },
  "sales-agent": {
    keywords: ["sales agent", "playbook", "virtual number"],
    preferredTopics: ["ai"],
  },
  "social-agent": {
    keywords: ["social agent"],
    preferredTopics: ["ai"],
  },
  "transactions-roles": {
    keywords: ["transaction", "roles", "permissions"],
    preferredTopics: ["transactions", "account-admin"],
  },
  documents: {
    keywords: ["document templates"],
    preferredTopics: ["transactions"],
  },
  checklists: {
    keywords: ["transaction", "checklists"],
    preferredTopics: ["transactions"],
  },
} satisfies Record<string, HelpPreset>;

export type HelpPresetId = keyof typeof helpPresets;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getArticleId(url: string) {
  const match = url.match(/\/articles\/(\d+)/);
  return match?.[1] ?? null;
}

function classifyDoc(id: string, title: string, sourceSection?: string): DocTopic {
  const override = topicOverrides[id];
  if (override) return override;

  const haystack = `${title} ${sourceSection ?? ""}`.trim();

  for (const rule of topicRules) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return rule.topic;
    }
  }

  return "other";
}

function normalizeDocs(rows: RawDocRow[]): HelpDoc[] {
  const docs: HelpDoc[] = [];
  let sourceSection: string | undefined;

  for (const row of rows) {
    if (row.url.includes("/sections/")) {
      sourceSection = row.text;
      continue;
    }

    if (!row.url.includes("/articles/")) {
      continue;
    }

    const id = getArticleId(row.url);
    if (!id) continue;

    docs.push({
      id,
      title: row.text,
      url: row.url,
      sourceSection,
      topic: classifyDoc(id, row.text, sourceSection),
      slug: slugify(row.text),
    });
  }

  return docs;
}

function scoreDoc(doc: HelpDoc, preset: HelpPreset) {
  const title = doc.title.toLowerCase();
  const section = (doc.sourceSection ?? "").toLowerCase();
  let score = 0;

  for (const keyword of preset.keywords) {
    const lowerKeyword = keyword.toLowerCase();
    const keywordSlug = slugify(lowerKeyword);

    if (title === lowerKeyword) score += 18;
    else if (title.includes(lowerKeyword)) score += 10;

    if (section.includes(lowerKeyword)) score += 6;
    if (doc.slug.includes(keywordSlug)) score += 4;
  }

  if (preset.preferredTopics?.includes(doc.topic)) {
    score += 5;
  }

  return score;
}

export const helpDocs = normalizeDocs(rawDocs as RawDocRow[]);
export const helpDocsById = new Map(helpDocs.map((doc) => [doc.id, doc] as const));

export const docTopicCounts = docTopicOrder.reduce(
  (acc, topic) => {
    acc[topic] = helpDocs.filter((doc) => doc.topic === topic).length;
    return acc;
  },
  {} as Record<DocTopic, number>,
);

export function getHelpDocById(id: string) {
  return helpDocsById.get(id);
}

export function getTopDocTopics(limit = 4) {
  return [...docTopicOrder]
    .filter((topic) => topic !== "other" && docTopicCounts[topic] > 0)
    .sort((a, b) => docTopicCounts[b] - docTopicCounts[a] || docTopicOrder.indexOf(a) - docTopicOrder.indexOf(b))
    .slice(0, limit);
}

export function getRelatedDocs(presetId: HelpPresetId, limit = 3) {
  const preset = helpPresets[presetId];
  if (!preset) return [];

  return [...helpDocs]
    .map((doc) => ({ doc, score: scoreDoc(doc, preset) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title) || a.doc.id.localeCompare(b.doc.id))
    .slice(0, limit)
    .map((entry) => entry.doc);
}
