import type { HTMLAttributes, ReactNode } from "react";

export function Table({ children, className = "" }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className={`min-w-full border-collapse text-left text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-border bg-app-bg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`border-b border-border px-3 py-2 ${className}`}>{children}</td>;
}
