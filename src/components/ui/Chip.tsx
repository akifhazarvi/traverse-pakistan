import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function Chip({
  children,
  icon,
  variant = "default",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
}
