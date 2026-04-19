import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { tutorials } from "@/lib/help/tutorials.content";

export default function TutorialsLibraryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Tutorials"
        description="Interactive walkthroughs with local progress storage. For official Lofty articles, browse Official docs."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {tutorials.map((t) => (
          <Link key={t.id} href={`/app/help/tutorials/${t.id}`} className="block">
            <Card className="h-full hover:bg-app-bg">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="mt-2 text-sm text-muted">{t.summary}</div>
              <div className="mt-3 text-xs text-muted">{t.estimatedMinutes} minutes · {t.steps.length} steps</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-app-bg px-2 py-0.5 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
