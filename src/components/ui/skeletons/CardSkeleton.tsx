import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Generic media card skeleton (image + title + meta + footer).
 * Shape matches TourCard / PackageCard / FeaturedHotels card.
 */
export function CardSkeleton() {
  return (
    <div
      className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-default)]"
    >
      <Skeleton className="w-full aspect-[5/4]" rounded="none" />
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-3 border-t border-[var(--border-default)] flex items-end justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
