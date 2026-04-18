import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  light?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { star: "text-sm", text: "text-xs" },
  md: { star: "text-base", text: "text-sm" },
  lg: { star: "text-lg", text: "text-base" },
};

export function StarRating({
  rating,
  size = "md",
  showValue = true,
  reviewCount,
  light,
  className,
}: StarRatingProps) {
  const styles = sizeStyles[size];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className={cn("flex gap-0.5", styles.star)}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              i < fullStars
                ? "text-[var(--primary-muted)]"
                : i === fullStars && hasHalf
                  ? "text-[var(--primary-muted)] opacity-60"
                  : light
                    ? "text-[var(--on-dark-tertiary)]"
                    : "text-[var(--border-default)]"
            )}
          >
            ★
          </span>
        ))}
      </div>
      {showValue && (
        <span
          className={cn(
            styles.text,
            "font-semibold",
            light ? "text-[var(--on-dark)]" : "text-[var(--text-primary)]"
          )}
        >
          {rating}
        </span>
      )}
      {reviewCount !== undefined && (
        <span
          className={cn(
            styles.text,
            light ? "text-[var(--on-dark-secondary)]" : "text-[var(--text-tertiary)]"
          )}
        >
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}
