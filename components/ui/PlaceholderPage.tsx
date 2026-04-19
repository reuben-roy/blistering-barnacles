import Link from "next/link";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import type { HelpPresetId } from "@/lib/help/docs.content";
import { PageHeader } from "./PageHeader";

export function PlaceholderPage({
  title,
  body,
  helpPreset,
}: {
  title: string;
  body: string;
  helpPreset?: HelpPresetId;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title={title} description={body} />
      {helpPreset ? <RelatedDocsCard presetId={helpPreset} /> : null}
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="text-accent hover:underline" href="/app">
          Back to dashboard
        </Link>
        <Link className="text-accent hover:underline" href="/app/help">
          Open Learning Hub
        </Link>
      </div>
    </div>
  );
}
