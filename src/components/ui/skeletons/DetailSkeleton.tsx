import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";

/**
 * Detail-page skeleton used for destination/[slug], grouptours/[slug],
 * packages/[slug], hotels/[slug]. Mirrors the hero → breadcrumb → title →
 * two-column body + sidebar layout.
 */
interface DetailSkeletonProps {
  /** Show a right-hand booking sidebar placeholder. */
  sidebar?: boolean;
  /** Use a shorter hero (used on destinations where meta is lighter). */
  compactHero?: boolean;
}

export function DetailSkeleton({ sidebar = true, compactHero }: DetailSkeletonProps) {
  return (
    <>
      {/* Hero */}
      <Skeleton
        className={compactHero ? "w-full h-[340px] sm:h-[400px]" : "w-full h-[400px] sm:h-[480px]"}
        rounded="none"
      />

      <Container className="py-8 sm:py-10">
        {/* Breadcrumb */}
        <Skeleton className="h-3 w-48 mb-6" />

        {/* Title + meta */}
        <div className="max-w-[780px] flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-7 w-24" rounded="full" />
            ))}
          </div>
        </div>

        {/* Two-column body */}
        <div className={sidebar ? "mt-10 lg:grid lg:grid-cols-[1fr_380px] lg:gap-10" : "mt-10"}>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-5 w-40 mt-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="p-5 border border-[var(--border-default)] rounded-[var(--radius-md)] flex gap-4"
                >
                  <Skeleton className="w-11 h-11 shrink-0" rounded="full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {sidebar && (
            <aside className="mt-8 lg:mt-0">
              <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] flex flex-col gap-4">
                <div className="flex items-end justify-between">
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-px w-full" solid />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-12 w-full" rounded="sm" />
                <Skeleton className="h-3 w-3/4 mx-auto" />
              </div>
            </aside>
          )}
        </div>
      </Container>
    </>
  );
}
