import type { ButtonHTMLAttributes, ReactNode } from "react";

interface FilterTabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  active: boolean;
  children: ReactNode;
}

export function FilterTab({
  active,
  children,
  className = "",
  ...props
}: FilterTabProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`h-8 min-w-24 cursor-pointer border-2 border-foreground px-4 font-display text-base font-medium leading-none uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "bg-foreground text-background hover:bg-foreground/90"
          : "bg-transparent text-foreground hover:bg-foreground/10"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
