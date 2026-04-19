import { GuideAssistantPage } from "@/components/guide/GuideAssistant";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="AI assistant"
        description="Ask where a setting lives and the guide will map the path. On desktop it can also highlight the exact controls for you."
      />
      <RelatedDocsCard presetId="ai-assistant" />
      <GuideAssistantPage />
    </div>
  );
}
