export type GuideTargetKind =
  | "nav-link"
  | "button"
  | "input"
  | "select"
  | "toggle"
  | "link";

export type GuideRevealAction = {
  type: "nav-group";
  groupId: string;
  expandShell?: boolean;
};

export type GuideTarget = {
  id: string;
  route: string;
  selector: string;
  label: string;
  kind: GuideTargetKind;
  reveal?: GuideRevealAction;
  fallbackHref?: string;
};

export type GuideStep = {
  targetId: string;
  title: string;
  instruction: string;
  routeOverride?: string;
};

export type GuideFlow = {
  id: string;
  title: string;
  samplePhrases: string[];
  synonyms: string[];
  assistantCopy: string;
  steps: GuideStep[];
};

export type ResolvedGuideStep = GuideStep & {
  index: number;
  route: string;
  target: GuideTarget;
};

export type GuideReplyStatus = "match" | "ambiguous" | "no-match";

export type GuideReply = {
  status: GuideReplyStatus;
  message: string;
  flowId?: string;
  steps: ResolvedGuideStep[];
  confidence: number;
  suggestions?: string[];
};

export type GuideMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  createdAt: number;
};
