import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "live" | "upcoming" | "completed" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    live: "bg-success/20 text-success border-success/30",
    upcoming: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
    completed: "bg-text-secondary/20 text-text-secondary border-text-secondary/30",
    default: "bg-surface text-text-secondary border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs uppercase tracking-wide font-sans font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
