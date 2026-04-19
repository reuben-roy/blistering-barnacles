import { DashboardClient } from "@/components/app/DashboardClient";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { leads, pipelineCounts } from "@/lib/fixtures/leads";

export default function DashboardPage() {
  const counts = pipelineCounts();
  const recent = leads.slice(0, 5);
  const hotCount = counts.Hot + counts.ApptSet;
  const aiSummary = `You have ${hotCount} leads in Hot or ApptSet. Focus today on ${recent[0]?.fullName ?? "your pipeline"} first contact SLAs.`;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader title="Dashboard" description="Demo KPIs generated from fixture leads and tasks." />
      <DashboardClient counts={counts} recentLeads={recent} aiSummary={aiSummary}>
        <RelatedDocsCard presetId="dashboard" />
      </DashboardClient>
    </div>
  );
}
