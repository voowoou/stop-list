import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "success" | "muted" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone: BadgeTone;
}

const toneClassNames: Record<BadgeTone, string> = {
  success: "bg-emerald-700 text-white",
  muted: "bg-muted text-foreground",
  accent: "bg-accent text-white",
};

export function Badge({
  children,
  className = "",
  tone,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`flex min-h-7 w-full items-center justify-center rounded-full px-4 py-1 font-sans text-sm font-medium leading-none uppercase ${toneClassNames[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
