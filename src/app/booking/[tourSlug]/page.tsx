import { redirect } from "next/navigation";
import { getAllTours } from "@/services/tour.service";

interface Props {
  params: Promise<{ tourSlug: string }>;
}

export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((t) => ({ tourSlug: t.slug }));
}

export default async function LegacyBookingRedirect({ params }: Props) {
  const { tourSlug } = await params;
  redirect(`/grouptours/${tourSlug}/checkout`);
}
