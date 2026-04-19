import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-app-bg px-6 py-16 text-text">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-accent">BrokerDesk Demo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">A CRM shell built for fast onboarding experiments</h1>
        <p className="mt-4 text-base text-muted">
          This scaffold mirrors common brokerage CRM layout patterns and ships with fake data, a CRM table, profile settings,
          and an interactive Learning Hub (search, FAQ, tutorials).
        </p>
        <div className="mt-8">
          <Link
            href="/app"
            className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open app
          </Link>
        </div>
        <ul className="mt-10 space-y-3 text-sm text-muted">
          <li>
            <span className="font-semibold text-text">CRM:</span> pipeline-style list and lead detail with a timeline.
          </li>
          <li>
            <span className="font-semibold text-text">AI:</span> module stubs in the top navigation for a guided tour.
          </li>
          <li>
            <span className="font-semibold text-text">Guided onboarding:</span> Cmd+K search, FAQ anchors, and tutorial progress stored locally.
          </li>
        </ul>
      </div>
    </div>
  );
}
