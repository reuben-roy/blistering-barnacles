import { PageHeader } from "@/components/ui/PageHeader";
import { GlossaryClient } from "@/components/help/GlossaryClient";
import { glossaryEntries } from "@/lib/help/glossary.content";

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Glossary" description="Short definitions for demo onboarding copy." />
      <GlossaryClient entries={glossaryEntries} />
    </div>
  );
}
