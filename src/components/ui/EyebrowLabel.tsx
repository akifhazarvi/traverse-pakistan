import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}

export function EyebrowLabel({ children, light, className }: EyebrowLabelProps) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-semibold uppercase tracking-[0.18em]",
        light ? "text-[var(--primary-muted)]" : "text-[var(--primary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
