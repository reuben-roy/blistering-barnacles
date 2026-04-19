import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import { leads, pipelineCounts } from "@/lib/fixtures/leads";
import { dashboardTasks } from "@/lib/fixtures/tasks";
import { formatRelativeTime } from "@/lib/format";

export default function DashboardPage() {
  const counts = pipelineCounts();
  const recent = leads.slice(0, 5);

  const hotCount = counts.Hot + counts.ApptSet;
  const aiSummary = `You have ${hotCount} leads in Hot or ApptSet. Focus today on ${recent[0]?.fullName ?? "your pipeline"} first contact SLAs.`;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Dashboard" description="Demo KPIs generated from fixture leads and tasks." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Pipeline</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(counts) as (keyof typeof counts)[]).map((k) => (
              <Badge key={k} tone={k === "Hot" || k === "ApptSet" ? "accent" : "neutral"}>
                {k}: {counts[k]}
              </Badge>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">AI summary (demo text)</div>
          <p className="mt-3 text-sm text-muted">{aiSummary}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Today&apos;s tasks</div>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboardTasks.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-b-0">
                <div>
                  <div className="font-medium text-text">{t.label}</div>
                  <div className="text-xs text-muted">Due {t.dueTime}</div>
                </div>
                {t.leadId ? (
                  <Link className="shrink-0 text-sm text-accent hover:underline" href={`/app/crm/leads/${t.leadId}`}>
                    Open lead
                  </Link>
                ) : (
                  <span className="text-xs text-muted">CRM</span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Recent leads</div>
            <Link className="text-sm text-accent hover:underline" href="/app/crm">
              View all
            </Link>
          </div>
          <div className="mt-3">
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Stage</Th>
                  <Th>Last activity</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id}>
                    <Td>
                      <Link className="font-medium text-accent hover:underline" href={`/app/crm/leads/${l.id}`}>
                        {l.fullName}
                      </Link>
                    </Td>
                    <Td>
                      <Badge>{l.stage}</Badge>
                    </Td>
                    <Td className="text-muted">{formatRelativeTime(l.lastActivityAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
