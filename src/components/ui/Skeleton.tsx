import { cn } from "@/lib/utils";

type SkeletonRounded = "sm" | "md" | "lg" | "full" | "none";

const radiusMap: Record<SkeletonRounded, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-[var(--radius-full)]",
  none: "",
};

interface SkeletonProps {
  className?: string;
  rounded?: SkeletonRounded;
  /** Disable shimmer (for cheaper nested blocks) */
  solid?: boolean;
}

export function Skeleton({ className, rounded = "sm", solid }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        solid ? "skeleton-solid" : "skeleton-shimmer",
        radiusMap[rounded],
        className
      )}
    />
  );
}
