import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Traverse Pakistan account, trips, and wishlist.",
};

const menuItems = [
  { label: "My Trips", href: "/account/trips", icon: "📋", description: "View your upcoming and past trips" },
  { label: "Wishlist", href: "/account/wishlist", icon: "❤️", description: "Tours you've saved for later" },
  { label: "Settings", href: "/account/settings", icon: "⚙️", description: "Profile and preferences" },
];

export default function AccountPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Account" }]} />
        <div className="mt-6 mb-10">
          <h1 className="text-[32px] font-bold text-[var(--text-primary)]">My Account</h1>
          <p className="text-[var(--text-tertiary)] mt-2">
            Account features are coming in Phase 2. For now, explore the platform!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[800px]">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-6 bg-[var(--bg-subtle)] rounded-xl hover:shadow-md transition-shadow text-center"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] mt-3">{item.label}</h3>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-1">{item.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
