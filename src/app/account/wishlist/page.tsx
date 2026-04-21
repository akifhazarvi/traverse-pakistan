import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function WishlistPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Wishlist" }]} />
        <EmptyState
          icon="heart"
          title="Your Wishlist is Empty"
          description="Save tours you love by tapping the heart icon. Persistent wishlist coming in Phase 2."
          action={
            <Link href="/grouptours">
              <Button size="lg">Explore Tours</Button>
            </Link>
          }
        />
      </Container>
    </div>
  );
}
