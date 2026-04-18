import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "info";
  className?: string;
}

const variantStyles = {
  default: "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]",
  success: "bg-[var(--primary-light)] text-[var(--primary-deep)] border-[var(--primary)]/20",
  info: "bg-[var(--bg-subtle)] text-[var(--info)] border-[var(--info)]/20",
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
