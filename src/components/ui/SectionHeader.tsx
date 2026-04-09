import { cn } from "@/lib/utils";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  linkText,
  linkHref,
  light,
  center,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-10",
        center
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <h2
          className={cn(
            "font-bold tracking-[-0.025em] leading-[1.15]",
            light ? "text-[var(--on-dark)]" : "text-[var(--text-primary)]"
          )}
          style={{ fontSize: "var(--text-4xl)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 max-w-xl leading-relaxed",
              light ? "text-[var(--on-dark-secondary)]" : "text-[var(--text-secondary)]"
            )}
            style={{ fontSize: "var(--text-lg)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className={cn(
            "text-[14px] font-semibold shrink-0 mt-2 sm:mt-0 transition-colors duration-[var(--duration-fast)]",
            light
              ? "text-[var(--primary-muted)] hover:text-[var(--on-dark)]"
              : "text-[var(--primary)] hover:text-[var(--primary-hover)]"
          )}
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  );
}
