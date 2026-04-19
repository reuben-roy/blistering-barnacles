import { faqItems } from "@/lib/help/faq.content";
import { tutorials } from "@/lib/help/tutorials.content";
import { leads } from "@/lib/fixtures/leads";
import { navSearchRecords } from "./nav-routes";
import type { SearchRecord } from "./types";

export function buildSearchIndex(): SearchRecord[] {
  const leadRecords: SearchRecord[] = leads.map((l) => ({
    id: `lead-${l.id}`,
    group: "Leads",
    title: l.fullName,
    subtitle: `${l.stage} · ${l.email}`,
    href: `/app/crm/leads/${l.id}`,
  }));

  const faqRecords: SearchRecord[] = faqItems.map((f) => ({
    id: `faq-${f.id}`,
    group: "Help",
    title: f.question,
    subtitle: f.category,
    href: `/app/help/faq#${f.id}`,
  }));

  const tutorialRecords: SearchRecord[] = tutorials.map((t) => ({
    id: `tut-${t.id}`,
    group: "Help",
    title: t.title,
    subtitle: t.summary,
    href: `/app/help/tutorials/${t.id}`,
  }));

  return [...leadRecords, ...faqRecords, ...tutorialRecords, ...navSearchRecords];
}

export function filterSearchIndex(
  records: SearchRecord[],
  query: string,
): SearchRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return records.slice(0, 40);
  return records
    .filter((r) => {
      const hay = `${r.title} ${r.subtitle ?? ""}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 50);
}
