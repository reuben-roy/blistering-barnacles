export type OnboardingTechLevel = "guided" | "self-serve";

export type RAGSourceKind = "faq" | "glossary" | "tutorial" | "guide" | "doc";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type RAGUserContext = {
  onboardingDay?: number;
  techLevel?: OnboardingTechLevel;
  completedSteps?: string[];
};

export type SupportContact = {
  email: string;
  phone: string;
  hours: string;
};

export type Source = {
  id: string;
  kind: RAGSourceKind;
  title: string;
  url: string;
  relevance: number;
  snippet?: string;
};

export type RAGResult = {
  answer: string;
  sources: Source[];
  insufficientContext: boolean;
  supportContact: SupportContact;
};

export type CorpusRecord = {
  id: string;
  kind: RAGSourceKind;
  title: string;
  url: string;
  content: string;
  searchText: string;
  snippet: string;
  keywords: string[];
  embedding: number[] | null;
  answerable: boolean;
};

export type RetrievalHit = {
  record: CorpusRecord;
  relevance: number;
  lexicalScore: number;
  vectorScore: number | null;
};

export type RetrievalContext = {
  answerHits: RetrievalHit[];
  docHits: RetrievalHit[];
  insufficientContext: boolean;
};

export type GeneratedCorpusArtifact = {
  version: number;
  generatedAt: string;
  embeddingModel: string | null;
  records: Omit<CorpusRecord, "answerable">[];
};

export type StructuredAnswer = {
  answer: string;
  sourceIds: string[];
  insufficientContext: boolean;
};
