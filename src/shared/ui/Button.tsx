import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "solid" | "outline" | "accent";
export type ButtonSize = "sm" | "md";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "border-foreground bg-foreground text-background hover:bg-foreground/90",
  outline:
    "border-foreground bg-transparent text-foreground hover:bg-foreground/10",
  accent: "border-accent bg-accent text-white hover:bg-accent/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4",
  md: "h-10 px-5",
};

export function Button({
  children,
  className = "",
  size = "sm",
  type = "button",
  variant = "outline",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap border-2 font-display text-base font-medium leading-[1.2] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
