import { GuideAssistantPage } from "@/components/guide/GuideAssistant";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="AI assistant"
        description="Ask where a setting lives, or ask a broader onboarding question. Strong UI-path matches stay guided, and broader questions use grounded help content."
      />
      <RelatedDocsCard presetId="ai-assistant" />
      <GuideAssistantPage />
    </div>
  );
}
