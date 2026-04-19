import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";
  const sizes = size === "sm" ? "px-2.5 py-1.5 text-sm" : "px-3.5 py-2 text-sm";
  const variants =
    variant === "primary"
      ? "bg-accent text-white hover:bg-blue-700"
      : variant === "secondary"
        ? "border border-border bg-surface text-text hover:bg-app-bg"
        : "text-accent hover:bg-app-bg";
  return <button type="button" className={`${base} ${sizes} ${variants} ${className}`} {...props} />;
}
