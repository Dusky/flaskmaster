import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-lg font-sans font-bold text-base transition-all duration-200 ease-in-out";

  const variantStyles = {
    primary:
      "bg-gold text-background shadow-[0_2px_4px_rgba(244,162,97,0.3)] hover:bg-[#f7b77e] hover:shadow-[0_4px_8px_rgba(244,162,97,0.4)] hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-transparent border border-gold text-gold hover:bg-gold/10 hover:border-[#f7b77e]",
    danger:
      "bg-danger text-text-primary shadow-[0_2px_4px_rgba(230,57,70,0.3)] hover:bg-[#f05959] hover:shadow-[0_4px_8px_rgba(230,57,70,0.4)] hover:-translate-y-0.5 active:translate-y-0",
  };

  const disabledStyles =
    "disabled:bg-[#3a3d4a] disabled:text-[#6b6e7a] disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:border-[#3a3d4a]";

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        disabledStyles,
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
