import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
  const appearance =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700"
      : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100";

  return <button className={`${base} ${appearance} ${className}`} {...props} />;
}
