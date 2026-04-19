import Link from "next/link";
import { PageHeader } from "./PageHeader";

export function PlaceholderPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={title} description={body} />
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
