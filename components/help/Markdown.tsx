import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const before = part.slice(0, part.indexOf("["));
      const after = part.slice(part.indexOf(")") + 1);
      return (
        <span key={i}>
          {before}
          <Link className="text-accent hover:underline" href={href}>
            {label}
          </Link>
          {after}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-text">
      {lines.map((line, idx) => (
        <p key={idx}>{renderInline(line)}</p>
      ))}
    </div>
  );
}
