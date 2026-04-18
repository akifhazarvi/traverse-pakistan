import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TripsList } from "@/components/account/TripsList";

export default function TripsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "My Trips" }]} />
        <div className="mt-6 mb-4">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)]">My Trips</h1>
          <p className="text-[var(--text-tertiary)] mt-2 text-[14px]">
            Upcoming and past trips booked with Traverse Pakistan.
          </p>
        </div>
        <TripsList />
      </Container>
    </div>
  );
}
