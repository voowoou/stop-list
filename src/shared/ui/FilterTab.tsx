import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";

interface FilterTabProps extends Omit<ButtonProps, "children" | "variant"> {
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
    <Button
      aria-pressed={active}
      className={`min-w-24 ${className}`}
      variant={active ? "solid" : "outline"}
      {...props}
    >
      {children}
    </Button>
  );
}
