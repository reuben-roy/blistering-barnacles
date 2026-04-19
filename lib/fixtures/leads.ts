import type { Lead, LeadActivity, LeadSource, LeadStage } from "./types";

const firstNames = [
  "Jordan",
  "Priya",
  "Marcus",
  "Elena",
  "Chris",
  "Sam",
  "Taylor",
  "Riley",
  "Avery",
  "Morgan",
  "Quinn",
  "Jamie",
  "Drew",
  "Casey",
  "Alex",
  "Blake",
  "Cameron",
  "Dana",
  "Emery",
  "Finley",
];

const lastNames = [
  "Ellis",
  "Shah",
  "Nguyen",
  "Ortega",
  "Patel",
  "Brooks",
  "Chen",
  "Garcia",
  "Hughes",
  "Ibrahim",
  "Johnson",
  "Kim",
  "Lopez",
  "Martinez",
  "Nelson",
  "Okonkwo",
  "Price",
  "Reyes",
  "Singh",
  "Turner",
];

const stages: LeadStage[] = ["New", "Nurture", "Hot", "ApptSet", "Closed", "Lost"];
const sources: LeadSource[] = [
  "IDX",
  "Referral",
  "OpenHouse",
  "PaidAds",
  "Sphere",
  "ZillowFlex",
  "Unknown",
];

const agents = ["Baylee Rhoades", "Alex Kim", "Jordan Lee", "Sam Rivera"];

const tagPool = [
  "Investor",
  "Relocation",
  "First-time",
  "Luxury",
  "Downsizing",
  "New build",
  "Land",
  "VA",
];

function hashPick<T>(seed: number, arr: T[]): T {
  return arr[Math.abs(seed) % arr.length];
}

function makeActivities(seed: number): LeadActivity[] {
  const types: LeadActivity["type"][] = ["call", "text", "email", "note", "showing", "system"];
  const count = 6 + (seed % 5);
  const out: LeadActivity[] = [];
  for (let i = 0; i < count; i++) {
    const at = new Date(Date.now() - (i + 1) * (3600000 + (seed % 7) * 900000)).toISOString();
    const type = types[(seed + i) % types.length];
    out.push({
      id: `act-${seed}-${i}`,
      at,
      type,
      title:
        type === "call"
          ? "Outbound call logged"
          : type === "text"
            ? "SMS thread updated"
            : type === "email"
              ? "Email sent: market snapshot"
              : type === "showing"
                ? "Showing completed"
                : type === "system"
                  ? "Automation: smart plan step"
                  : "Internal note added",
      body:
        type === "note"
          ? "Client prefers weekend showings and wants a single-level home if possible."
          : undefined,
    });
  }
  return out;
}

function makeNotes(seed: number) {
  return [
    {
      id: `note-${seed}-1`,
      at: new Date(Date.now() - 86400000 * 2).toISOString(),
      text: "Asked about school districts near Arcadia.",
    },
    {
      id: `note-${seed}-2`,
      at: new Date(Date.now() - 86400000 * 5).toISOString(),
      text: "Budget flexible if yard and garage meet needs.",
    },
    {
      id: `note-${seed}-3`,
      at: new Date(Date.now() - 86400000 * 9).toISOString(),
      text: "Referred by past client at 2210 W Elm.",
    },
  ];
}

function buildLead(i: number): Lead {
  const seed = i * 7919;
  const fn = hashPick(seed, firstNames);
  const ln = hashPick(seed + 1, lastNames);
  const stage = hashPick(seed + 2, stages);
  const source = hashPick(seed + 3, sources);
  const tags = [hashPick(seed + 4, tagPool), hashPick(seed + 5, tagPool)].filter(
    (t, idx, arr) => arr.indexOf(t) === idx,
  );
  const intent = hashPick(seed + 6, ["Buy", "Sell", "Both", "Unknown"] as const);
  const priceBase = 350000 + (seed % 900000);
  return {
    id: `lead-${i}`,
    fullName: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    phone: `(602) 555-${String(1000 + (seed % 8999)).padStart(4, "0")}`,
    stage,
    source,
    tags,
    assignedTo: hashPick(seed + 8, agents),
    lastActivityAt: new Date(Date.now() - (seed % 72) * 3600000).toISOString(),
    intent,
    address: `${800 + (seed % 200)} ${hashPick(seed, ["N Central", "E Camelback", "W Glendale", "S Rural", "N Scottsdale"])} Ave`,
    priceMin: Math.round(priceBase * 0.85),
    priceMax: Math.round(priceBase * 1.1),
    activities: makeActivities(seed),
    notes: makeNotes(seed),
  };
}

export const leads: Lead[] = Array.from({ length: 40 }, (_, idx) => buildLead(idx + 1));

export function getLeadById(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function pipelineCounts(): Record<LeadStage, number> {
  const init: Record<LeadStage, number> = {
    New: 0,
    Nurture: 0,
    Hot: 0,
    ApptSet: 0,
    Closed: 0,
    Lost: 0,
  };
  for (const l of leads) {
    init[l.stage] += 1;
  }
  return init;
}
