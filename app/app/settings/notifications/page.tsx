import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsForm } from "@/components/app/NotificationsForm";

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Notifications" description="Local-only toggles for demo UI." />
      <RelatedDocsCard presetId="notifications" />
      <NotificationsForm />
    </div>
  );
}
