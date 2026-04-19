import type { ConversationMessage } from "../rag";
import type { GuideMessage, GuideReply } from "./types";

export const GUIDE_CONFIDENCE_THRESHOLD = 0.75;

export function shouldUseGuideReply(reply: GuideReply) {
  return reply.status === "match" && reply.confidence >= GUIDE_CONFIDENCE_THRESHOLD;
}

export function toConversationHistory(messages: GuideMessage[]): ConversationMessage[] {
  return messages.slice(-6).map((message) => ({
    role: message.role,
    content: message.text,
  }));
}
