import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "accent" | "danger" };

export function Badge({ tone = "neutral", className = "", ...props }: Props) {
  const tones =
    tone === "accent"
      ? "bg-blue-50 text-accent border-blue-100"
      : tone === "danger"
        ? "bg-red-50 text-danger border-red-100"
        : "bg-app-bg text-muted border-border";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tones} ${className}`}
      {...props}
    />
  );
}
