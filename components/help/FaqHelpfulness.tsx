"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { readFaqFeedback, writeFaqFeedbackItem } from "@/lib/storage/faq-feedback";

export function FaqHelpfulness({ itemId }: { itemId: string }) {
  const [value, setValue] = useState<"yes" | "no" | undefined>(() => readFaqFeedback()[itemId]);

  return (
    <div className="flex items-center gap-2 border-t border-border pt-3">
      <span className="text-xs text-muted">Was this helpful?</span>
      <Button
        variant={value === "yes" ? "primary" : "secondary"}
        size="sm"
        onClick={() => {
          writeFaqFeedbackItem(itemId, "yes");
          setValue("yes");
        }}
      >
        Yes
      </Button>
      <Button
        variant={value === "no" ? "primary" : "secondary"}
        size="sm"
        onClick={() => {
          writeFaqFeedbackItem(itemId, "no");
          setValue("no");
        }}
      >
        No
      </Button>
    </div>
  );
}
