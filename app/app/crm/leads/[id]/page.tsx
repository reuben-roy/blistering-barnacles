import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { getLeadById } from "@/lib/fixtures/leads";
import { formatRelativeTime } from "@/lib/format";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={lead.fullName}
          description={`Last activity ${formatRelativeTime(lead.lastActivityAt)}`}
          actions={<Badge tone="accent">{lead.stage}</Badge>}
        />
        <Link className="text-sm text-accent hover:underline" href="/app/crm">
          Back to CRM
        </Link>
      </div>
      <RelatedDocsCard presetId="crm-lead" />

      <Tabs
        defaultId="overview"
        items={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <Card>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-muted">Email</div>
                    <div>{lead.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted">Phone</div>
                    <div>{lead.phone}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs font-semibold text-muted">Address</div>
                    <div>{lead.address ?? "Not provided"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted">Intent</div>
                    <div>{lead.intent}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted">Price band</div>
                    <div>
                      {lead.priceMin && lead.priceMax
                        ? `$${lead.priceMin.toLocaleString()} - $${lead.priceMax.toLocaleString()}`
                        : "Not provided"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted">Source</div>
                    <div>{lead.source}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted">Assigned</div>
                    <div>{lead.assignedTo}</div>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            id: "activity",
            label: "Activity",
            content: (
              <Card>
                <ol className="space-y-4">
                  {lead.activities.map((a) => (
                    <li key={a.id} className="border-l-2 border-border pl-4">
                      <div className="text-xs text-muted">{formatRelativeTime(a.at)}</div>
                      <div className="text-sm font-medium">{a.title}</div>
                      {a.body ? <div className="mt-1 text-sm text-muted">{a.body}</div> : null}
                    </li>
                  ))}
                </ol>
              </Card>
            ),
          },
          {
            id: "notes",
            label: "Notes",
            content: (
              <Card>
                <ul className="space-y-3">
                  {lead.notes.map((n) => (
                    <li key={n.id} className="rounded-md border border-border bg-app-bg p-3 text-sm">
                      <div className="text-xs text-muted">{formatRelativeTime(n.at)}</div>
                      <div className="mt-1">{n.text}</div>
                  </li>
                  ))}
                </ul>
                <label className="mt-4 block text-sm text-muted">
                  Add note (demo, not saved)
                  <textarea className="mt-1 w-full rounded-md border border-border p-2 text-sm" rows={3} disabled />
                </label>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
