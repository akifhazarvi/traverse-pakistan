import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export const dynamic = "force-dynamic";

export default function AdminBookingsPage() {
  return (
    <AdminComingSoon
      title="Bookings"
      description="List, confirm, cancel, and refund bookings."
    />
  );
}
