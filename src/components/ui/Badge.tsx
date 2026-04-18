import { cn } from "@/lib/utils";
import type { BadgeType } from "@/types/tour";

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig: Record<
  NonNullable<BadgeType>,
  { label: string; className: string }
> = {
  "on-sale": {
    label: "ON SALE",
    className: "bg-[var(--warning)] text-white",
  },
  "epic-trek": {
    label: "EPIC TREK",
    className: "bg-[var(--primary)] text-[var(--text-inverse)]",
  },
  bestseller: {
    label: "BESTSELLER",
    className: "bg-[var(--text-primary)] text-white",
  },
  new: {
    label: "NEW",
    className: "bg-[var(--info)] text-white",
  },
};

export function Badge({ type, className }: BadgeProps) {
  if (!type) return null;
  const config = badgeConfig[type];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] rounded-[var(--radius-full)]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
