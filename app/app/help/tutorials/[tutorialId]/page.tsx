import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { TutorialRunner } from "@/components/help/TutorialRunner";
import { getTutorialById } from "@/lib/help/tutorials.content";

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ tutorialId: string }>;
}) {
  const { tutorialId } = await params;
  const tutorial = getTutorialById(tutorialId);
  if (!tutorial) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title={tutorial.title} description={tutorial.summary} />
      <TutorialRunner tutorial={tutorial} />
    </div>
  );
}
