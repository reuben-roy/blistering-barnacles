import { getGuideFlow, guideFlows, resolveGuideFlowSteps } from "./catalog";
import { matchesGuideRoute } from "./routes";
import type { GuideFlow, GuideReply } from "./types";

export const guideExamplePrompts = [
  "Where do I change the username?",
  "How do I change my password?",
  "Turn off SMS notifications",
  "How do I find a lead?",
];

const GUIDE_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "where",
]);

function normalizeGuideText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(value: string) {
  return normalizeGuideText(value)
    .split(/\s+/)
    .filter((token) => token && !GUIDE_STOP_WORDS.has(token));
}

function overlapScore(queryTokens: string[], candidate: string) {
  const candidateTokens = new Set(tokenize(candidate));
  return queryTokens.reduce((score, token) => score + (candidateTokens.has(token) ? 1 : 0), 0);
}

function scoreGuideFlow(flow: GuideFlow, query: string, pathname?: string) {
  const normalizedQuery = normalizeGuideText(query);
  const queryTokens = tokenize(query);
  let score = 0;

  for (const phrase of flow.samplePhrases) {
    const normalizedPhrase = normalizeGuideText(phrase);
    if (normalizedQuery.includes(normalizedPhrase)) {
      score += 12 + normalizedPhrase.split(" ").length;
    } else {
      score += overlapScore(queryTokens, phrase) * 1.25;
    }
  }

  for (const synonym of flow.synonyms) {
    const normalizedSynonym = normalizeGuideText(synonym);
    if (normalizedQuery.includes(normalizedSynonym)) {
      score += 6 + normalizedSynonym.split(" ").length * 0.5;
    } else {
      score += overlapScore(queryTokens, synonym) * 0.75;
    }
  }

  score += overlapScore(queryTokens, flow.title) * 1.5;

  for (const step of resolveGuideFlowSteps(flow.id)) {
    score += overlapScore(queryTokens, step.title) * 0.5;
    score += overlapScore(queryTokens, step.target.label) * 0.5;

    if (pathname && matchesGuideRoute(step.route, pathname)) {
      score += 1.5;
    }
  }

  return score;
}

function buildFallbackReply(): GuideReply {
  return {
    status: "no-match",
    message:
      "I couldn't map that request to a guided path yet. Try one of the supported examples below and I'll highlight the exact controls for you.",
    confidence: 0,
    steps: [],
    suggestions: guideExamplePrompts,
  };
}

function buildFlowReply(flowId: string, status: GuideReply["status"], message: string, confidence: number): GuideReply {
  return {
    status,
    message,
    flowId,
    confidence,
    steps: resolveGuideFlowSteps(flowId),
  };
}

export function resolveGuideIntent(query: string, pathname?: string): GuideReply {
  const normalizedQuery = normalizeGuideText(query);
  if (!normalizedQuery) return buildFallbackReply();

  if (normalizedQuery.includes("username") || normalizedQuery.includes("user name")) {
    return buildFlowReply(
      "profile-name",
      "ambiguous",
      'If by "username" you mean the name shown on your profile, use this path. If you meant your email login instead, ask me about changing your email address.',
      0.78,
    );
  }

  const ranked = guideFlows
    .map((flow) => ({ flow, score: scoreGuideFlow(flow, normalizedQuery, pathname) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 5) {
    return buildFallbackReply();
  }

  const runnerUp = ranked[1];
  const bestFlow = getGuideFlow(best.flow.id);
  if (!bestFlow) return buildFallbackReply();

  if (runnerUp && best.score - runnerUp.score < 1.5 && best.score < 10) {
    return buildFlowReply(
      bestFlow.id,
      "ambiguous",
      `${bestFlow.assistantCopy} This looks like the closest guided path I have right now.`,
      0.62,
    );
  }

  return buildFlowReply(
    bestFlow.id,
    "match",
    `${bestFlow.assistantCopy} I found a guided path for that request.`,
    Math.min(0.95, Number((0.4 + best.score / 25).toFixed(2))),
  );
}
