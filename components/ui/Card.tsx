import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "interactive" | "highlighted";
  noPadding?: boolean;
}

export function Card({
  children,
  variant = "default",
  noPadding = false,
  className,
  ...props
}: CardProps) {
  const baseStyles =
    "bg-surface rounded-card border border-white/10 shadow-card";

  const variantStyles = {
    default: "",
    interactive:
      "cursor-pointer transition-all duration-200 hover:border-white/20 hover:shadow-card-hover hover:-translate-y-0.5",
    highlighted: "border-gold",
  };

  const paddingStyles = noPadding ? "" : "p-6";

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], paddingStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}
