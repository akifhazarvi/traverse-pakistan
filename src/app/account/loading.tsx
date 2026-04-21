import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-8 sm:py-12">
      <Skeleton className="h-3 w-24 mb-6" />
      <Skeleton className="h-8 w-64 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[800px]">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="p-6 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex flex-col items-center gap-3"
          >
            <Skeleton className="w-12 h-12" rounded="full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </Container>
  );
}
