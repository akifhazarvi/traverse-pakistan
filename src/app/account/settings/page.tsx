import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function SettingsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Settings" }]} />
        <div className="mt-6 text-center py-16 max-w-md mx-auto">
          <span className="text-5xl">⚙️</span>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4">Account Settings</h1>
          <p className="text-[var(--text-tertiary)] mt-2">
            Profile and preference management will be available in Phase 2 with user authentication.
          </p>
        </div>
      </Container>
    </div>
  );
}
