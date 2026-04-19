"use client";

const KEY = "faq.feedback.v1";

export type FaqFeedbackMap = Record<string, "yes" | "no">;

export function readFaqFeedback(): FaqFeedbackMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FaqFeedbackMap;
  } catch {
    return {};
  }
}

export function writeFaqFeedbackItem(itemId: string, value: "yes" | "no") {
  const map = readFaqFeedback();
  map[itemId] = value;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}
