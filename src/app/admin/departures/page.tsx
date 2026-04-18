import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export const dynamic = "force-dynamic";

export default function AdminDeparturesPage() {
  return (
    <AdminComingSoon
      title="Departures"
      description="Add dates, edit seats and pricing per tour."
    />
  );
}
