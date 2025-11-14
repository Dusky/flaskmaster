import { cn } from "@/lib/utils";

interface StatDisplayProps {
  label: string;
  value: string | number;
  context?: string;
  className?: string;
  valueColor?: "gold" | "success" | "danger" | "primary";
}

export function StatDisplay({
  label,
  value,
  context,
  className,
  valueColor = "gold",
}: StatDisplayProps) {
  const colorStyles = {
    gold: "text-gold",
    success: "text-success",
    danger: "text-danger",
    primary: "text-text-primary",
  };

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="text-xs uppercase tracking-wide text-text-secondary mb-1">
        {label}
      </div>
      <div className={cn("text-3xl font-mono font-bold", colorStyles[valueColor])}>
        {value}
      </div>
      {context && (
        <div className="text-sm text-text-secondary mt-1">{context}</div>
      )}
    </div>
  );
}
