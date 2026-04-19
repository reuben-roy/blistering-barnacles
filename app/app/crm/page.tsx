import { CrmClient } from "@/components/app/CrmClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { leads } from "@/lib/fixtures/leads";

export default function CrmPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="CRM" description="Search and filter are local-only against fixture leads." />
      <CrmClient leads={leads} />
    </div>
  );
}
