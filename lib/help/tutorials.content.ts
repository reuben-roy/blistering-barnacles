export type TutorialStepType = "read" | "navigate" | "confirm" | "quiz";

export type TutorialQuiz = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type TutorialStep = {
  id: string;
  title: string;
  body: string;
  type: TutorialStepType;
  href?: string;
  quiz?: TutorialQuiz;
};

export type Tutorial = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  tags: string[];
  steps: TutorialStep[];
};

export const tutorials: Tutorial[] = [
  {
    id: "first-day",
    title: "First day in BrokerDesk",
    summary: "Set your profile, hours, and learn where Help lives.",
    estimatedMinutes: 8,
    tags: ["Onboarding", "Profile"],
    steps: [
      {
        id: "s1",
        title: "Welcome",
        body: "BrokerDesk is a demo scaffold. Use the Learning Hub to search anything while you click around.",
        type: "read",
      },
      {
        id: "s2",
        title: "Open your profile",
        body: "Accurate profile data improves routing, signatures, and client trust.",
        type: "navigate",
        href: "/app/settings/profile",
      },
      {
        id: "s3",
        title: "Confirm you understand demo scope",
        body: "Check the box to confirm you will not treat demo text as legal advice.",
        type: "confirm",
      },
      {
        id: "s4",
        title: "Quick quiz: where should users go for onboarding help?",
        body: "Pick the best answer to unlock the next step.",
        type: "quiz",
        quiz: {
          prompt: "Where is the primary Help entry in this scaffold?",
          choices: [
            "Only inside CRM settings",
            "The right utility rail Help icon and /app/help",
            "There is no Help area",
            "Only on the marketing landing page",
          ],
          correctIndex: 1,
          explanation: "Help is always reachable from the utility rail and the /app/help Learning Hub.",
        },
      },
      {
        id: "s5",
        title: "Try global search",
        body: "Press Cmd+K (Mac) or Ctrl+K (Windows) and search for a lead name.",
        type: "read",
      },
    ],
  },
  {
    id: "lead-routing",
    title: "Set up lead routing (guided)",
    summary: "Walk the screens you would use before turning on automation.",
    estimatedMinutes: 12,
    tags: ["Leads", "Routing"],
    steps: [
      {
        id: "s1",
        title: "Review capture sources",
        body: "Know which sources are high intent before you assign them.",
        type: "navigate",
        href: "/app/lead-settings/capture",
      },
      {
        id: "s2",
        title: "Review routing page",
        body: "Routing is where round-robin and geo rules typically live in a CRM-like product.",
        type: "navigate",
        href: "/app/lead-settings/routing",
      },
      {
        id: "s3",
        title: "Read FAQ on duplicates",
        body: "Duplicates break reporting. Merge carefully.",
        type: "navigate",
        href: "/app/help/faq#duplicate-leads",
      },
    ],
  },
  {
    id: "tcpa-readiness",
    title: "Compliance checklist (demo)",
    summary: "Educational steps only. Confirm with your broker for real policies.",
    estimatedMinutes: 10,
    tags: ["Compliance"],
    steps: [
      {
        id: "s1",
        title: "Read consent FAQ",
        body: "Understand why consent status exists in modern CRMs.",
        type: "navigate",
        href: "/app/help/faq#tcpa-consent",
      },
      {
        id: "s2",
        title: "Quiz: best practice before automated SMS",
        body: "Choose the best answer.",
        type: "quiz",
        quiz: {
          prompt: "Before enabling automated SMS nurture, what should a team do in real life?",
          choices: [
            "Send messages immediately to every imported contact",
            "Define consent capture with broker or counsel and store proof",
            "Turn on AI and skip consent because speed matters most",
            "Delete all contacts to avoid risk",
          ],
          correctIndex: 1,
          explanation: "Consent workflows should be defined with qualified guidance for your market.",
        },
      },
    ],
  },
  {
    id: "ai-copilot-tour",
    title: "AI Copilots tour",
    summary: "Visit the AI module stubs grouped in the left sidebar.",
    estimatedMinutes: 6,
    tags: ["AI"],
    steps: [
      {
        id: "s1",
        title: "Open AI overview",
        body: "This is a placeholder route for IA completeness.",
        type: "navigate",
        href: "/app/ai/overview",
      },
      {
        id: "s2",
        title: "Open Sales Agent",
        body: "In a real product, this would link to configuration and guardrails.",
        type: "navigate",
        href: "/app/ai/sales-agent",
      },
    ],
  },
];

export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find((t) => t.id === id);
}
