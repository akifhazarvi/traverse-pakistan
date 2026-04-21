import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <Container>
        <EmptyState
          icon="compass"
          title="This trail doesn't exist"
          description="The page you're looking for may have moved, or the link might be outdated. Let's get you back on the map."
          action={
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button size="lg">Back to Home</Button>
              </Link>
              <Link href="/grouptours">
                <Button variant="outline" size="lg">Browse Tours</Button>
              </Link>
            </div>
          }
        />
      </Container>
    </div>
  );
}
