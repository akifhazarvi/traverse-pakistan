import { ListingSkeleton } from "@/components/ui/skeletons/ListingSkeleton";

export default function Loading() {
  return <ListingSkeleton cardCount={6} showFilters={false} />;
}
