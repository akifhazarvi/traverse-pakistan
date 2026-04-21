import { ListingSkeleton } from "@/components/ui/skeletons/ListingSkeleton";

/** Root fallback — streamed while any top-level page segment resolves. */
export default function Loading() {
  return <ListingSkeleton cardCount={6} showFilters={false} />;
}
