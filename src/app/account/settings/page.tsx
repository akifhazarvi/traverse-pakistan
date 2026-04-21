import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SettingsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Settings" }]} />
        <EmptyState
          icon="gear"
          title="Account Settings"
          description="Profile and preference management will be available in Phase 2 with user authentication."
        />
      </Container>
    </div>
  );
}
