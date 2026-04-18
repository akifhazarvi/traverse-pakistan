import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/guard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div
      className="flex min-h-[calc(100vh-80px)]"
      style={{ background: "var(--bg-subtle)" }}
    >
      <AdminSidebar email={session.email} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
