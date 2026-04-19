import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = "", id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="block text-sm">
      {label ? <span className="mb-1 block text-muted">{label}</span> : null}
      <input
        id={inputId}
        className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none ring-accent focus:border-accent focus:ring-2 ${className}`}
        {...props}
      />
    </label>
  );
}
