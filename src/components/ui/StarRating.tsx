import { cn } from "@/lib/utils";
import { Icon, type IconSize } from "@/components/ui/Icon";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  light?: boolean;
  className?: string;
}

const iconSize: Record<NonNullable<StarRatingProps["size"]>, IconSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const textSize: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function StarRating({
  rating,
  size = "md",
  showValue = true,
  reviewCount,
  light,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  const filledColor = "var(--primary-muted)";
  const emptyColor = light ? "var(--on-dark-tertiary)" : "var(--border-default)";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="inline-flex gap-0.5" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => {
          const isFull = i < fullStars;
          const isHalf = !isFull && i === fullStars && hasHalf;
          return (
            <Icon
              key={i}
              name="star"
              size={iconSize[size]}
              weight={isFull ? "fill" : isHalf ? "duotone" : "regular"}
              color={isFull || isHalf ? filledColor : emptyColor}
            />
          );
        })}
      </div>
      {showValue && (
        <span
          className={cn(
            textSize[size],
            "font-semibold tabular-nums",
            light ? "text-[var(--on-dark)]" : "text-[var(--text-primary)]"
          )}
        >
          {rating}
        </span>
      )}
      {reviewCount !== undefined && (
        <span
          className={cn(
            textSize[size],
            light ? "text-[var(--on-dark-secondary)]" : "text-[var(--text-tertiary)]"
          )}
        >
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}
