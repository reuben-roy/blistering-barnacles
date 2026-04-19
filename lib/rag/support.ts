import type { RAGResult, Source, SupportContact } from "./types";

export const SUPPORT_CONTACT: SupportContact = {
  email: "support@lofty.com",
  phone: "1-855-981-7557",
  hours: "8am-8pm EST, Mon-Sun",
};

export function buildSupportFallback(sources: Source[] = []): RAGResult {
  return {
    answer:
      "I couldn't find enough detail in the local help content to safely walk you through that. Please contact Lofty Support at support@lofty.com or 1-855-981-7557. Support is available 8am-8pm EST, Mon-Sun.",
    sources,
    insufficientContext: true,
    supportContact: SUPPORT_CONTACT,
  };
}
