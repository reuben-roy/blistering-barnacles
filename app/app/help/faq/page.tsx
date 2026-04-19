import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { FaqClient } from "@/components/help/FaqClient";
import { faqItems } from "@/lib/help/faq.content";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="FAQ"
        description="Category filters update the URL. Deep links use anchors like /app/help/faq#tcpa-consent."
      />
      <Suspense fallback={<div className="text-sm text-muted">Loading FAQ…</div>}>
        <FaqClient items={faqItems} />
      </Suspense>
    </div>
  );
}
