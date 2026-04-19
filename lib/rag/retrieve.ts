import { getAnswerCorpusRecords, getDocReferenceRecords } from "./corpus";
import { cosineSimilarity, lexicalScore } from "./text";
import type { CorpusRecord, RetrievalContext, RetrievalHit } from "./types";

const MAX_ANSWER_HITS = 4;
const MAX_DOC_HITS = 3;
const MIN_ANSWER_RELEVANCE = 0.24;
const MIN_DOC_RELEVANCE = 0.18;

function rankRecord(record: CorpusRecord, question: string, queryEmbedding: number[] | null): RetrievalHit {
  const lexical = lexicalScore(question, [record.title, record.searchText, record.keywords.join(" ")]);
  const vector = queryEmbedding && record.embedding ? cosineSimilarity(queryEmbedding, record.embedding) : null;
  const blended = vector === null ? lexical : lexical * 0.65 + Math.max(vector, 0) * 0.35;

  return {
    record,
    relevance: Number(blended.toFixed(4)),
    lexicalScore: lexical,
    vectorScore: vector,
  };
}

function sortHits(hits: RetrievalHit[]) {
  return hits.sort(
    (left, right) =>
      right.relevance - left.relevance ||
      right.lexicalScore - left.lexicalScore ||
      left.record.title.localeCompare(right.record.title),
  );
}

export function retrieveLocalContext(question: string, queryEmbedding: number[] | null): RetrievalContext {
  const answerHits = sortHits(getAnswerCorpusRecords().map((record) => rankRecord(record, question, queryEmbedding)))
    .filter((hit) => hit.relevance >= MIN_ANSWER_RELEVANCE)
    .slice(0, MAX_ANSWER_HITS);

  const docHits = sortHits(getDocReferenceRecords().map((record) => rankRecord(record, question, queryEmbedding)))
    .filter((hit) => hit.relevance >= MIN_DOC_RELEVANCE)
    .slice(0, MAX_DOC_HITS);

  const topAnswer = answerHits[0];
  const topDoc = docHits[0];
  const insufficientContext =
    answerHits.length === 0 ||
    Boolean(
      topAnswer &&
        topDoc &&
        topAnswer.relevance < 0.55 &&
        topDoc.relevance > topAnswer.relevance + 0.18,
    ) ||
    Boolean(
      topAnswer &&
        topDoc &&
        topAnswer.relevance < 0.32 &&
        topDoc.relevance >= topAnswer.relevance,
    );

  return {
    answerHits,
    docHits,
    insufficientContext,
  };
}
