import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
  return (
    <AdminComingSoon
      title="Reviews"
      description="Approve or reject user-submitted reviews."
    />
  );
}
