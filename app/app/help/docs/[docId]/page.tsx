import { notFound, redirect } from "next/navigation";
import { getHelpDocById } from "@/lib/help/docs.content";

export default async function HelpDocRedirectPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const doc = getHelpDocById(docId);
  if (!doc) notFound();

  redirect(doc.url);
}
