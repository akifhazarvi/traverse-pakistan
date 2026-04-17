import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TripsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "My Trips" }]} />
        <div className="mt-6 text-center py-16 max-w-md mx-auto">
          <span className="text-5xl">🎒</span>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4">No Trips Yet</h1>
          <p className="text-[var(--text-tertiary)] mt-2">
            Once you book a tour, your trips will appear here. Booking feature coming in Phase 2!
          </p>
          <Link href="/grouptours" className="inline-block mt-6">
            <Button size="lg">Browse Tours</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
