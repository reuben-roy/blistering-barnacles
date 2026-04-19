import artifact from "./generated/local-answer-corpus.generated.json";
import { buildDocReferenceRecords } from "./build";
import type { CorpusRecord, GeneratedCorpusArtifact } from "./types";

const generated = artifact as GeneratedCorpusArtifact;

export function getAnswerCorpusRecords(): CorpusRecord[] {
  return generated.records.map((record) => ({
    ...record,
    answerable: true,
  }));
}

export function getDocReferenceRecords() {
  return buildDocReferenceRecords();
}
