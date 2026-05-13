# blistering-barnacles

> Hackathon-ready scaffold for a real-estate SaaS dashboard — CRM, AI copilots, automation, and a built-in RAG-powered Learning Hub.

## What It Does

`blistering-barnacles` is a Next.js demo scaffold that replicates the surface area of a modern real-estate operating system. It ships with:

- **Marketing Site** — A landing page ("Lofty Solution Suite") with brand header, feature pitch, and footer.
- **App Shell** — A full dashboard experience with collapsible sidebar navigation, utility rail, and page chrome.
- **CRM** — Lead pipeline, search, filters, and detail views (populated with fixture data).
- **AI Copilots** — Stub pages for an AI Assistant, Sales Agent, and Social Agent.
- **Communication** — Inbox, texting, and calling workspace stubs.
- **Automation & Marketplace** — Workflow builder and marketplace browsing placeholders.
- **Transactions** — Roles, checklist templates, and document template pages.
- **Settings** — Profile, account security (with 2FA), notifications, integrations, organization, and vendor settings.
- **Learning Hub** — Docs library, FAQ, glossary, tutorials, and a command palette.
- **RAG Support Engine** — Retrieval-Augmented Generation pipeline using OpenAI / Anthropic for contextual help answers.
- **In-App Guide System** — DOM-targeted walkthroughs that can highlight any nav link, form input, or button and drive users through multi-step flows.

Built as a hackathon / proof-of-concept scaffold, it pairs a polished marketing skin with a believable app interior.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| UI Icons | [Lucide React](https://lucide.dev/) |
| Calendar | [FullCalendar](https://fullcalendar.io/) (React bindings) |
| Fonts | Inter, Manrope, Figtree (Google Fonts) |

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server with Turbopack
npm run dev

# Open http://localhost:3000
```

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (Turbopack) |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm run build:rag-corpus` | Compile and build the RAG help corpus |
| `npm run test:guide` | Run guide-system & RAG unit tests |

## Project Structure

```
app/
  page.tsx                 # Marketing landing site
  layout.tsx               # Root layout (Inter font)
  app/                     # Authenticated dashboard
    page.tsx               # Dashboard home
    ai/                    # AI Copilot pages
    automation/            # Automation builder stub
    communication/         # Inbox, texting, calling
    content/               # Content management stub
    crm/                   # CRM leads & pipeline
    help/                  # Learning Hub (docs, FAQ, glossary, tutorials)
    lead-settings/         # Capture, routing, tags, import
    marketing/             # Marketing stub
    marketplace/           # Marketplace stub
    reporting/             # Reporting stub
    sales/                 # Sales stub
    settings/              # Profile, account, notifications, integrations
    transactions/            # Roles, checklists, documents
components/
  app/                     # Dashboard-specific components
  guide/                   # Guide overlay, assistant, provider
  help/                    # Command palette, docs, FAQ, glossary, tutorials
  marketing/               # Landing-page components
  shell/                   # AppShell, SideNav, UtilityRail, nav config
  ui/                      # Reusable primitives (Button, Card, Input, Tabs, ...)
lib/
  fixtures/                # Demo lead, task, org, user data
  guide/                   # Guide catalog, resolution, session, validation, tests
  help/                    # Static help content (docs, FAQ, glossary, tutorials)
  rag/                     # RAG pipeline: corpus, retrieval, prompts, OpenAI/Anthropic adapters, tests
  search/                  # Nav search index builder
  storage/                 # localStorage abstractions ( preferences, progress )
scripts/
  build-rag-corpus.ts      # Builds the RAG answer corpus from help content
```

## Notable Systems

### RAG Support Engine

Help articles, FAQs, and tutorials are indexed into a local corpus. When a user asks a question in the assistant chat:

1. `lib/rag/retrieve.ts` scores passages with BM25 + keyword overlap.
2. Top chunks are injected into an LLM prompt (OpenAI or Anthropic).
3. The model returns a contextual answer with citation links.

Build the corpus after editing help content:

```bash
npm run build:rag-corpus
```

### In-App Guide System

Multi-step guided tours are declared in `lib/guide/catalog.ts` as `GuideFlow`s. Each step targets a DOM element via `data-guide` attributes. The system supports:

- Nav-group auto-expansion
- Element highlighting with overlays
- Fallback href navigation when DOM isn't available
- Session state tracking (started / completed / dismissed)

### Command Palette

`Ctrl+K` (or `Cmd+K`) opens a fuzzy-searchable palette over all nav routes, help docs, and settings pages.

## License

No explicit LICENSE file. Assume all rights reserved unless otherwise stated.

---

Scaffolded with curiosity by [Reuben Roy](https://github.com/reuben-roy).
