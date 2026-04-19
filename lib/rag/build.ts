import { faqItems } from "../help/faq.content";
import { glossaryEntries } from "../help/glossary.content";
import { helpDocs } from "../help/docs.content";
import { tutorials } from "../help/tutorials.content";
import { guideFlows, resolveGuideFlowSteps } from "../guide/catalog";
import { stripMarkdown, summarizeSnippet } from "./text";
import type { CorpusRecord, GeneratedCorpusArtifact } from "./types";

function dedupe(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function buildAnswerCorpusRecords(): CorpusRecord[] {
  const faqRecords: CorpusRecord[] = faqItems.map((item) => ({
    id: `faq:${item.id}`,
    kind: "faq",
    title: item.question,
    url: `/app/help/faq#${item.id}`,
    content: stripMarkdown(item.answerMd),
    searchText: [
      item.question,
      item.answerMd,
      item.category,
      item.relatedLinks?.map((link) => link.label).join(" "),
      item.snippet?.label,
      item.snippet?.text,
    ]
      .filter(Boolean)
      .join("\n"),
    snippet: summarizeSnippet(item.answerMd),
    keywords: dedupe([
      item.category,
      item.question,
      ...(item.relatedLinks?.map((link) => link.label) ?? []),
    ]),
    embedding: null,
    answerable: true,
  }));

  const glossaryRecords: CorpusRecord[] = glossaryEntries.map((entry) => ({
    id: `glossary:${entry.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "glossary",
    title: entry.term,
    url: "/app/help/glossary",
    content: entry.definition,
    searchText: `${entry.term}\nWhat is ${entry.term}?\n${entry.definition}`,
    snippet: summarizeSnippet(entry.definition),
    keywords: dedupe([entry.term, `what is ${entry.term}`]),
    embedding: null,
    answerable: true,
  }));

  const tutorialRecords: CorpusRecord[] = tutorials.map((tutorial) => ({
    id: `tutorial:${tutorial.id}`,
    kind: "tutorial",
    title: tutorial.title,
    url: `/app/help/tutorials/${tutorial.id}`,
    content: [tutorial.summary, ...tutorial.steps.map((step) => `${step.title}: ${step.body}`)].join("\n"),
    searchText: [
      tutorial.title,
      tutorial.summary,
      tutorial.tags.join(" "),
      ...tutorial.steps.map((step) => `${step.title} ${step.body}`),
    ].join("\n"),
    snippet: summarizeSnippet(tutorial.summary),
    keywords: dedupe([tutorial.title, ...tutorial.tags, ...tutorial.steps.map((step) => step.title)]),
    embedding: null,
    answerable: true,
  }));

  const guideRecords: CorpusRecord[] = guideFlows.map((flow) => {
    const resolvedSteps = resolveGuideFlowSteps(flow.id);
    const firstRoute = resolvedSteps[0]?.route ?? "/app/ai/assistant";
    const stepsText = resolvedSteps
      .map((step, index) => `${index + 1}. ${step.title} - ${step.instruction}`)
      .join("\n");

    return {
      id: `guide:${flow.id}`,
      kind: "guide",
      title: flow.title,
      url: firstRoute,
      content: `${flow.assistantCopy}\n${stepsText}`,
      searchText: [
        flow.title,
        flow.assistantCopy,
        flow.samplePhrases.join(" "),
        flow.synonyms.join(" "),
        stepsText,
      ].join("\n"),
      snippet: summarizeSnippet(flow.assistantCopy),
      keywords: dedupe([
        flow.title,
        ...flow.samplePhrases,
        ...flow.synonyms,
        ...resolvedSteps.map((step) => step.title),
      ]),
      embedding: null,
      answerable: true,
    } satisfies CorpusRecord;
  });

  return [...faqRecords, ...glossaryRecords, ...tutorialRecords, ...guideRecords];
}

export function buildDocReferenceRecords(): CorpusRecord[] {
  return helpDocs.map((doc) => ({
    id: `doc:${doc.id}`,
    kind: "doc",
    title: doc.title,
    url: doc.url,
    content: doc.sourceSection
      ? `${doc.title}\nSection: ${doc.sourceSection}`
      : doc.title,
    searchText: [doc.title, doc.sourceSection, doc.topic.replace(/-/g, " ")].filter(Boolean).join("\n"),
    snippet: doc.sourceSection
      ? `Official doc · ${doc.sourceSection}`
      : "Official Lofty Help Center article",
    keywords: dedupe([doc.title, doc.sourceSection ?? "", doc.topic.replace(/-/g, " ")]),
    embedding: null,
    answerable: false,
  }));
}

export function createGeneratedCorpusArtifact(
  records: CorpusRecord[],
  generatedAt = new Date().toISOString(),
  embeddingModel: string | null = null,
): GeneratedCorpusArtifact {
  return {
    version: 1,
    generatedAt,
    embeddingModel,
    records: records.map((record) => ({
      id: record.id,
      kind: record.kind,
      title: record.title,
      url: record.url,
      content: record.content,
      searchText: record.searchText,
      snippet: record.snippet,
      keywords: record.keywords,
      embedding: record.embedding,
    })),
  };
}
