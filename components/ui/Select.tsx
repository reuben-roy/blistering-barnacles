import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, className = "", id, children, ...props }: Props) {
  const sid = id ?? props.name;
  return (
    <label className="block text-sm">
      {label ? <span className="mb-1 block text-muted">{label}</span> : null}
      <select
        id={sid}
        className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
