function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "by",
  "do",
  "does",
  "for",
  "go",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "should",
  "the",
  "this",
  "to",
  "up",
  "what",
  "where",
]);

export function stripMarkdown(value: string) {
  return normalizeWhitespace(
    value
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1"),
  );
}

export function normalizeText(value: string) {
  return normalizeWhitespace(value.toLowerCase().replace(/[^a-z0-9]+/g, " "));
}

export function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean);
}

export function uniqueTokens(value: string) {
  return [...new Set(tokenize(value).filter((token) => !STOP_WORDS.has(token)))];
}

function phraseBonus(haystack: string, needle: string) {
  if (!needle) return 0;
  if (haystack.includes(needle)) {
    return Math.min(0.45, 0.08 + needle.split(" ").length * 0.04);
  }
  return 0;
}

function overlapRatio(queryTokens: string[], candidateTokens: string[]) {
  if (!queryTokens.length || !candidateTokens.length) return 0;
  const candidateSet = new Set(candidateTokens);
  const overlap = queryTokens.filter((token) => candidateSet.has(token)).length;
  return overlap / Math.max(queryTokens.length, 1);
}

export function lexicalScore(query: string, fields: string[]) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = uniqueTokens(query);
  if (!normalizedQuery || !queryTokens.length) return 0;

  const normalizedFields = fields.map((field) => normalizeText(field));
  const tokenSets = fields.map((field) => uniqueTokens(field));
  const matchedTokens = new Set<string>();

  for (const fieldTokens of tokenSets) {
    for (const token of queryTokens) {
      if (fieldTokens.includes(token)) {
        matchedTokens.add(token);
      }
    }
  }

  const overallCoverage = matchedTokens.size / queryTokens.length;
  const titleCoverage = overlapRatio(queryTokens, tokenSets[0] ?? []);
  const keywordCoverage = overlapRatio(queryTokens, tokenSets[2] ?? []);
  const bestPhraseBonus = normalizedFields.reduce(
    (best, field) => Math.max(best, phraseBonus(field, normalizedQuery)),
    0,
  );

  const score =
    overallCoverage * 0.72 +
    titleCoverage * 0.2 +
    keywordCoverage * 0.08 +
    bestPhraseBonus * 0.25;

  return Number(Math.min(1, score).toFixed(4));
}

export function cosineSimilarity(left: number[], right: number[]) {
  if (!left.length || left.length !== right.length) return null;

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let i = 0; i < left.length; i += 1) {
    dot += left[i] * right[i];
    leftNorm += left[i] * left[i];
    rightNorm += right[i] * right[i];
  }

  const denominator = Math.sqrt(leftNorm) * Math.sqrt(rightNorm);
  if (!denominator) return null;
  return Number((dot / denominator).toFixed(6));
}

export function summarizeSnippet(value: string, maxLength = 180) {
  const clean = stripMarkdown(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}
