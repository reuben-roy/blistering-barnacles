import { createGroundedAnswer } from "./anthropic";
import { createQueryEmbedding } from "./openai";
import { retrieveLocalContext } from "./retrieve";
import { buildSupportFallback, SUPPORT_CONTACT } from "./support";
import type { ConversationMessage, RAGResult, RAGUserContext, Source } from "./types";

function mapSources(
  ids: string[],
  hits: ReturnType<typeof retrieveLocalContext>["answerHits"],
) {
  const byId = new Map(hits.map((hit) => [hit.record.id, hit] as const));

  const sources = ids
    .map((id) => byId.get(id))
    .filter((hit): hit is (typeof hits)[number] => Boolean(hit))
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

  // When the local corpus (FAQs/guides/tutorials) is insufficient but help docs matched
  // well, promote those docs to answer-bearing context so GPT can answer from them.
  const useDocsAsPrimary = retrieval.insufficientContext && retrieval.docHits.length > 0;
  const effectiveAnswerHits = useDocsAsPrimary ? retrieval.docHits : retrieval.answerHits;
  const effectiveDocHits = useDocsAsPrimary ? [] : retrieval.docHits;

  // No context at all — give up early.
  if (effectiveAnswerHits.length === 0) {
    return buildSupportFallback([]);
  }

  const structured = await createGroundedAnswer({
    question: userQuestion,
    history: conversationHistory.slice(-6),
    userContext,
    answerHits: effectiveAnswerHits,
    docHits: effectiveDocHits,
  });

  if (structured.insufficientContext) {
    return buildSupportFallback(mapDocSources(retrieval.docHits));
  }

  return {
    answer: structured.answer,
    sources: mapSources(structured.sourceIds, effectiveAnswerHits),
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
