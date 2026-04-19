import { PageHeader } from "@/components/ui/PageHeader";
import { HelpHubClient } from "@/components/help/HelpHubClient";

export default function HelpHomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Learning Hub"
        description="Search, learn, and do: official docs, interactive tutorials, FAQ, and deep links into the app shell."
      />
      <HelpHubClient />
    </div>
  );
}
