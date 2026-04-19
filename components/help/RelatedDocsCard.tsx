import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  docTopicLabels,
  getRelatedDocs,
  type HelpPresetId,
} from "@/lib/help/docs.content";

export function RelatedDocsCard({
  presetId,
  title = "Related official docs",
}: {
  presetId: HelpPresetId;
  title?: string;
}) {
  const docs = getRelatedDocs(presetId, 3);
  if (!docs.length) return null;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-text">{title}</div>
          <div className="mt-1 text-sm text-muted">Matched official Lofty Help Center articles for this page.</div>
        </div>
        <Link className="text-sm text-accent hover:underline" href="/app/help/docs">
          Browse all docs
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {docs.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-text">{doc.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge>{docTopicLabels[doc.topic]}</Badge>
                {doc.sourceSection ? <span className="text-xs text-muted">{doc.sourceSection}</span> : null}
              </div>
            </div>
            <Link
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-sm text-accent hover:underline"
            >
              Open article
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
