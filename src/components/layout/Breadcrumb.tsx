import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean;
  className?: string;
}

export function Breadcrumb({ items, light, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-[13px]", className)}>
      <Link
        href="/"
        className={cn(
          "font-medium transition-colors",
          light ? "text-white/70 hover:text-white" : "text-[var(--text-tertiary)] hover:text-[var(--primary)]"
        )}
      >
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={light ? "text-white/40" : "text-[var(--text-tertiary)]/50"}>
            ›
          </span>
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "font-medium transition-colors",
                light ? "text-white/70 hover:text-white" : "text-[var(--text-tertiary)] hover:text-[var(--primary)]"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn("font-medium", light ? "text-white" : "text-[var(--text-primary)]")}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
