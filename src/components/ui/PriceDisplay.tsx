import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { price: "text-sm font-bold", original: "text-xs" },
  md: { price: "text-base font-bold", original: "text-sm" },
  lg: { price: "text-2xl font-bold", original: "text-base" },
};

export function PriceDisplay({
  price,
  originalPrice,
  prefix = "From",
  size = "md",
  light,
  className,
}: PriceDisplayProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn(
          styles.price,
          light ? "text-white" : "text-[var(--text-primary)]"
        )}
      >
        {prefix} {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span
          className={cn(
            styles.original,
            "line-through",
            light ? "text-white/50" : "text-[var(--text-tertiary)]"
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}
      {originalPrice && originalPrice > price && (
        <span className="text-xs font-semibold text-[var(--warning)]">
          Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
        </span>
      )}
    </div>
  );
}
