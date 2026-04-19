import { createGroundedAnswer } from "./anthropic";
import { createQueryEmbedding } from "./openai";
import { retrieveLocalContext } from "./retrieve";
import { buildSupportFallback, SUPPORT_CONTACT } from "./support";
import type { ConversationMessage, RAGResult, RAGUserContext, Source } from "./types";

function mapSources(ids: string[], answerHits: ReturnType<typeof retrieveLocalContext>["answerHits"]) {
  const byId = new Map(answerHits.map((hit) => [hit.record.id, hit] as const));

  const sources = ids
    .map((id) => byId.get(id))
    .filter((hit): hit is (typeof answerHits)[number] => Boolean(hit))
    .map((hit) => ({
      id: hit.record.id,
      kind: hit.record.kind,
      title: hit.record.title,
      url: hit.record.url,
      relevance: hit.relevance,
      snippet: hit.record.snippet,
    }));

  return sources satisfies Source[];
}

function mapDocSources(docHits: ReturnType<typeof retrieveLocalContext>["docHits"]) {
  const sources = docHits.map((hit) => ({
    id: hit.record.id,
    kind: hit.record.kind,
    title: hit.record.title,
    url: hit.record.url,
    relevance: hit.relevance,
    snippet: hit.record.snippet,
  }));

  return sources satisfies Source[];
}

export async function queryRAG(
  userQuestion: string,
  conversationHistory: ConversationMessage[] = [],
  userContext?: RAGUserContext,
): Promise<RAGResult> {
  const queryEmbedding = await createQueryEmbedding(userQuestion).catch(() => null);
  const retrieval = retrieveLocalContext(userQuestion, queryEmbedding);

  if (retrieval.insufficientContext) {
    return buildSupportFallback(mapDocSources(retrieval.docHits));
  }

  const structured = await createGroundedAnswer({
    question: userQuestion,
    history: conversationHistory.slice(-6),
    userContext,
    answerHits: retrieval.answerHits,
    docHits: retrieval.docHits,
  });

  if (structured.insufficientContext) {
    return buildSupportFallback(mapDocSources(retrieval.docHits));
  }

  return {
    answer: structured.answer,
    sources: mapSources(structured.sourceIds, retrieval.answerHits),
    insufficientContext: false,
    supportContact: SUPPORT_CONTACT,
  };
}

export type {
  ConversationMessage,
  OnboardingTechLevel,
  RAGResult,
  RAGSourceKind,
  RAGUserContext,
  Source,
} from "./types";
