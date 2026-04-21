import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import { CardGridSkeleton } from "./CardSkeleton";

/**
 * Listing-page skeleton: breadcrumb → title → filter row → card grid.
 * Used for /grouptours, /destinations, /packages, /hotels, /blog.
 */
interface ListingSkeletonProps {
  showFilters?: boolean;
  cardCount?: number;
}

export function ListingSkeleton({ showFilters = true, cardCount = 6 }: ListingSkeletonProps) {
  return (
    <Container className="py-8 sm:py-12">
      <Skeleton className="h-3 w-32" />
      <div className="mt-6 mb-10">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-[460px] mt-3 max-w-full" />
      </div>
      {showFilters && (
        <div className="mb-8 flex gap-2 flex-wrap">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-24" rounded="full" />
          ))}
        </div>
      )}
      <CardGridSkeleton count={cardCount} />
    </Container>
  );
}
