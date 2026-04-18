import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AccountGreeting } from "@/components/account/AccountGreeting";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Traverse Pakistan account, trips, and wishlist.",
  robots: { index: false, follow: false },
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
        <AccountGreeting />
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
