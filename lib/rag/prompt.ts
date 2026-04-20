import { SUPPORT_CONTACT } from "./support";
import type { ConversationMessage, RAGUserContext, RetrievalHit } from "./types";

export function isFrustrated(question: string, history: ConversationMessage[] = []) {
  const haystack = [question, ...history.map((message) => message.content)].join("\n").toLowerCase();
  return [
    "totally lost",
    "this is confusing",
    "i'm confused",
    "im confused",
    "frustrated",
    "stuck",
    "annoyed",
    "not working",
    "doesn't work",
    "doesnt work",
    "why is this so hard",
  ].some((pattern) => haystack.includes(pattern));
}

function formatHistory(history: ConversationMessage[]) {
  if (!history.length) return "None";
  return history
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");
}

function formatUserContext(userContext?: RAGUserContext) {
  return [
    `Onboarding day: ${userContext?.onboardingDay ?? "unknown"}`,
    `Experience level: ${userContext?.techLevel ?? "guided"}`,
    `Completed setup steps: ${userContext?.completedSteps?.join(", ") || "none yet"}`,
  ].join("\n");
}

function formatHits(label: string, hits: RetrievalHit[]) {
  if (!hits.length) return `${label}:\nNone`;

  return `${label}:\n${hits
    .map(
      (hit) =>
        `ID: ${hit.record.id}\nKIND: ${hit.record.kind}\nTITLE: ${hit.record.title}\nURL: ${hit.record.url}\nCONTENT: ${hit.record.content}`,
    )
    .join("\n\n")}`;
}

export function buildSystemPrompt(frustrated: boolean) {
  return `You are an onboarding assistant for Lofty, an AI-powered real estate CRM platform.
You help real estate agents who are often new to CRM software get set up and productive quickly.

Your job is to answer clearly, in plain English, without assuming technical knowledge.
Never use jargon without explaining it.
Never say "navigate to" — say "click on."

TOOL USE:
- You have a fetch_doc_content tool. Call it with a help.lofty.com URL when the article title is relevant but you need the body text to answer accurately.
- Fetch before answering — do not guess at article content.
- You may fetch up to 3 articles. After fetching, call submit_answer with the answer grounded in what you retrieved.

ANSWERING RULES:
1. Answer ONLY from the provided context or content you fetched via fetch_doc_content.
2. If you do not have enough detail after fetching, set insufficientContext to true.
3. Keep answers short and helpful.
4. Use numbered steps for procedures.
5. Never give more than 5 steps at once.
6. End procedural answers with: "Does that make sense, or would you like me to walk through any step in more detail?"
7. ${frustrated ? "The user sounds frustrated. Acknowledge that briefly before answering." : "If the user sounds frustrated, acknowledge that briefly before answering."}
8. Reference-only docs (when present) can be mentioned as extra reading. When docs appear under ANSWER-BEARING CONTEXT, fetch them if you need their body text.

TONE:
- Warm, patient, never condescending
- Like a knowledgeable colleague sitting next to them

NEVER:
- Say "I'm just an AI"
- Use the phrase "As per the documentation"
- Invent a Lofty feature, screen, or step
- Tell the user to contact support unless insufficientContext is true

Support contact when insufficientContext is true:
- Email: ${SUPPORT_CONTACT.email}
- Phone: ${SUPPORT_CONTACT.phone}
- Hours: ${SUPPORT_CONTACT.hours}`;
}

export function buildUserPrompt(params: {
  question: string;
  history: ConversationMessage[];
  userContext?: RAGUserContext;
  answerHits: RetrievalHit[];
  docHits: RetrievalHit[];
}) {
  return [
    `USER CONTEXT:\n${formatUserContext(params.userContext)}`,
    `RECENT HISTORY:\n${formatHistory(params.history)}`,
    formatHits("ANSWER-BEARING CONTEXT", params.answerHits),
    formatHits("REFERENCE-ONLY DOCS", params.docHits),
    `USER QUESTION:\n${params.question}`,
    "Return a grounded answer using the submit_answer tool.",
  ].join("\n\n");
}
