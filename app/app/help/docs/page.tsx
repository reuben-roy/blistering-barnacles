import { DocsLibraryClient } from "@/components/help/DocsLibraryClient";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DocsLibraryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Official docs"
        description="Search and filter the linked Lofty Help Center catalog without leaving the app until you open an article."
      />
      <DocsLibraryClient />
    </div>
  );
}
