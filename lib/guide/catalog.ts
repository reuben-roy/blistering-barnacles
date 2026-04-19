import { SHELL_ROUTE } from "./routes";
import type { GuideFlow, GuideTarget, ResolvedGuideStep } from "./types";
import { validateGuideCatalog } from "./validation";

export const guideTargets: GuideTarget[] = [
  {
    id: "shell.sidenav.crm",
    route: SHELL_ROUTE,
    selector: '[data-guide="shell.sidenav.link.crm"]',
    label: "CRM",
    kind: "nav-link",
    reveal: { type: "nav-group", groupId: "daily-work", expandShell: true },
    fallbackHref: "/app/crm",
  },
  {
    id: "shell.sidenav.profile",
    route: SHELL_ROUTE,
    selector: '[data-guide="shell.sidenav.link.profile"]',
    label: "Profile",
    kind: "nav-link",
    reveal: { type: "nav-group", groupId: "account", expandShell: true },
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "shell.sidenav.account",
    route: SHELL_ROUTE,
    selector: '[data-guide="shell.sidenav.link.account-security"]',
    label: "Account & Security",
    kind: "nav-link",
    reveal: { type: "nav-group", groupId: "account", expandShell: true },
    fallbackHref: "/app/settings/account",
  },
  {
    id: "shell.sidenav.notifications",
    route: SHELL_ROUTE,
    selector: '[data-guide="shell.sidenav.link.notifications"]',
    label: "Notifications",
    kind: "nav-link",
    reveal: { type: "nav-group", groupId: "account", expandShell: true },
    fallbackHref: "/app/settings/notifications",
  },
  {
    id: "shell.utility.settings",
    route: SHELL_ROUTE,
    selector: '[data-guide="shell.utility.settings"]',
    label: "Settings",
    kind: "link",
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "settings.profile.first-name",
    route: "/app/settings/profile",
    selector: '[data-guide="settings.profile.first-name"]',
    label: "First name",
    kind: "input",
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "settings.profile.last-name",
    route: "/app/settings/profile",
    selector: '[data-guide="settings.profile.last-name"]',
    label: "Last name",
    kind: "input",
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "settings.profile.change-email",
    route: "/app/settings/profile",
    selector: '[data-guide="settings.profile.change-email"]',
    label: "Change email address",
    kind: "button",
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "settings.profile.upload-photo",
    route: "/app/settings/profile",
    selector: '[data-guide="settings.profile.upload-photo"]',
    label: "Upload photo",
    kind: "button",
    fallbackHref: "/app/settings/profile",
  },
  {
    id: "settings.account.change-password",
    route: "/app/settings/account",
    selector: '[data-guide="settings.account.change-password"]',
    label: "Change password",
    kind: "button",
    fallbackHref: "/app/settings/account",
  },
  {
    id: "settings.account.enable-2fa",
    route: "/app/settings/account",
    selector: '[data-guide="settings.account.enable-2fa"]',
    label: "Enable 2FA",
    kind: "button",
    fallbackHref: "/app/settings/account",
  },
  {
    id: "settings.notifications.email-toggle",
    route: "/app/settings/notifications",
    selector: '[data-guide="settings.notifications.email-toggle"]',
    label: "Email notifications",
    kind: "toggle",
    fallbackHref: "/app/settings/notifications",
  },
  {
    id: "settings.notifications.sms-toggle",
    route: "/app/settings/notifications",
    selector: '[data-guide="settings.notifications.sms-toggle"]',
    label: "SMS notifications",
    kind: "toggle",
    fallbackHref: "/app/settings/notifications",
  },
  {
    id: "settings.notifications.quiet-start",
    route: "/app/settings/notifications",
    selector: '[data-guide="settings.notifications.quiet-start"]',
    label: "Quiet hours start",
    kind: "input",
    fallbackHref: "/app/settings/notifications",
  },
  {
    id: "crm.search",
    route: "/app/crm",
    selector: '[data-guide="crm.search"]',
    label: "CRM search",
    kind: "input",
    fallbackHref: "/app/crm",
  },
  {
    id: "crm.stage-filter",
    route: "/app/crm",
    selector: '[data-guide="crm.stage-filter"]',
    label: "Stage filter",
    kind: "select",
    fallbackHref: "/app/crm",
  },
  {
    id: "crm.source-filter",
    route: "/app/crm",
    selector: '[data-guide="crm.source-filter"]',
    label: "Source filter",
    kind: "select",
    fallbackHref: "/app/crm",
  },
];

export const guideFlows: GuideFlow[] = [
  {
    id: "profile-name",
    title: "Change your profile name",
    samplePhrases: [
      "where do I change the username",
      "change my name",
      "update my profile name",
    ],
    synonyms: ["username", "profile name", "display name", "first name", "last name"],
    assistantCopy: "Your displayed name lives in Profile settings.",
    steps: [
      {
        targetId: "shell.sidenav.profile",
        title: "Open Profile",
        instruction: "In Account, click Profile.",
      },
      {
        targetId: "settings.profile.first-name",
        title: "Edit first name",
        instruction: "Update the First name field.",
      },
      {
        targetId: "settings.profile.last-name",
        title: "Edit last name",
        instruction: "Update the Last name field.",
      },
    ],
  },
  {
    id: "profile-email",
    title: "Change your email address",
    samplePhrases: [
      "change my email",
      "where do I change my email address",
      "update login email",
    ],
    synonyms: ["email address", "login email", "change email"],
    assistantCopy: "Email updates start from your Profile settings.",
    steps: [
      {
        targetId: "shell.sidenav.profile",
        title: "Open Profile",
        instruction: "In Account, click Profile.",
      },
      {
        targetId: "settings.profile.change-email",
        title: "Change your email address",
        instruction: "Use Change email address to start the update.",
      },
    ],
  },
  {
    id: "profile-photo",
    title: "Change your profile photo",
    samplePhrases: [
      "change profile photo",
      "update my picture",
      "where do I upload a photo",
    ],
    synonyms: ["profile picture", "avatar", "upload photo"],
    assistantCopy: "Profile photos are managed from the top of your Profile screen.",
    steps: [
      {
        targetId: "shell.sidenav.profile",
        title: "Open Profile",
        instruction: "In Account, click Profile.",
      },
      {
        targetId: "settings.profile.upload-photo",
        title: "Upload a new photo",
        instruction: "Click Upload photo to choose a new image.",
      },
    ],
  },
  {
    id: "account-password",
    title: "Change your password",
    samplePhrases: [
      "change my password",
      "where do I change my password",
      "reset my password",
    ],
    synonyms: ["password", "login password", "security"],
    assistantCopy: "Password controls live in Account & Security.",
    steps: [
      {
        targetId: "shell.sidenav.account",
        title: "Open Account & Security",
        instruction: "In Account, click Account & Security.",
      },
      {
        targetId: "settings.account.change-password",
        title: "Choose Change password",
        instruction: "Use Change password to begin the reset flow.",
      },
    ],
  },
  {
    id: "account-2fa",
    title: "Enable two-factor authentication",
    samplePhrases: [
      "enable two factor authentication",
      "turn on 2fa",
      "set up authenticator app",
    ],
    synonyms: ["2fa", "two factor", "multi factor", "authenticator"],
    assistantCopy: "Two-factor settings are in Account & Security.",
    steps: [
      {
        targetId: "shell.sidenav.account",
        title: "Open Account & Security",
        instruction: "In Account, click Account & Security.",
      },
      {
        targetId: "settings.account.enable-2fa",
        title: "Enable 2FA",
        instruction: "Click Enable 2FA to start setup.",
      },
    ],
  },
  {
    id: "notifications-overview",
    title: "Change notification settings",
    samplePhrases: [
      "change notifications",
      "notification settings",
      "where do I control alerts",
    ],
    synonyms: ["notifications", "alerts", "quiet hours", "notification preferences"],
    assistantCopy: "Notification preferences are grouped under Notifications.",
    steps: [
      {
        targetId: "shell.sidenav.notifications",
        title: "Open Notifications",
        instruction: "In Account, click Notifications.",
      },
      {
        targetId: "settings.notifications.email-toggle",
        title: "Adjust delivery channels",
        instruction: "Use the channel toggles to turn notifications on or off.",
      },
      {
        targetId: "settings.notifications.quiet-start",
        title: "Set quiet hours",
        instruction: "Adjust Quiet hours if you want a no-alert window.",
      },
    ],
  },
  {
    id: "notifications-sms",
    title: "Turn SMS notifications on or off",
    samplePhrases: [
      "turn off sms notifications",
      "change text alerts",
      "where do I manage sms notifications",
    ],
    synonyms: ["sms", "text alerts", "text notifications"],
    assistantCopy: "SMS notification controls are inside Notifications.",
    steps: [
      {
        targetId: "shell.sidenav.notifications",
        title: "Open Notifications",
        instruction: "In Account, click Notifications.",
      },
      {
        targetId: "settings.notifications.sms-toggle",
        title: "Toggle SMS notifications",
        instruction: "Use the SMS switch to change text alert delivery.",
      },
    ],
  },
  {
    id: "crm-search",
    title: "Find a lead in CRM",
    samplePhrases: [
      "find a lead",
      "search crm",
      "where do I look up a contact",
    ],
    synonyms: ["crm", "lead search", "contact search", "search name"],
    assistantCopy: "Lead lookups start from the CRM workspace.",
    steps: [
      {
        targetId: "shell.sidenav.crm",
        title: "Open CRM",
        instruction: "Use CRM in the left sidebar.",
      },
      {
        targetId: "crm.search",
        title: "Search by name or email",
        instruction: "Type the lead's name or email into the CRM search box.",
      },
    ],
  },
  {
    id: "crm-stage-filter",
    title: "Filter CRM by stage",
    samplePhrases: [
      "filter leads by stage",
      "where do I change the lead stage filter",
      "show only hot leads",
    ],
    synonyms: ["stage filter", "hot leads", "apptset", "lead stage"],
    assistantCopy: "Stage filtering happens directly inside CRM.",
    steps: [
      {
        targetId: "shell.sidenav.crm",
        title: "Open CRM",
        instruction: "Use CRM in the left sidebar.",
      },
      {
        targetId: "crm.stage-filter",
        title: "Choose a stage",
        instruction: "Open the Stage filter and pick the stage you want to see.",
      },
    ],
  },
];

export const guideTargetMap = new Map(guideTargets.map((target) => [target.id, target] as const));
export const guideFlowMap = new Map(guideFlows.map((flow) => [flow.id, flow] as const));

export function getGuideTarget(id: string) {
  return guideTargetMap.get(id) ?? null;
}

export function getGuideFlow(id: string) {
  return guideFlowMap.get(id) ?? null;
}

export function resolveGuideFlowSteps(flowId: string): ResolvedGuideStep[] {
  const flow = getGuideFlow(flowId);
  if (!flow) return [];

  return flow.steps.flatMap((step, index) => {
    const target = getGuideTarget(step.targetId);
    if (!target) return [];

    return [
      {
        ...step,
        index,
        route: step.routeOverride ?? target.route,
        target,
      },
    ];
  });
}

export const guideCatalogValidation = validateGuideCatalog(guideTargets, guideFlows);

if (!guideCatalogValidation.ok && process.env.NODE_ENV !== "production") {
  console.error("Guide catalog validation failed:", guideCatalogValidation.errors);
}
