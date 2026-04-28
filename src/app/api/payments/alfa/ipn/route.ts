import { NextRequest, NextResponse } from "next/server";
import { alfaConfig } from "@/lib/alfa/config";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData().catch(() => null);
    const ipnUrl = body?.get("url") as string | null;

    if (!ipnUrl) {
      return NextResponse.json({ error: "Missing url param" }, { status: 400 });
    }

    const statusRes = await fetch(ipnUrl);
    const status = await statusRes.json();

    const orderId: string = status.TransactionReferenceNumber ?? "";
    const isPaid: boolean = status.TransactionStatus === "Paid";

    if (orderId) {
      const supabase = await getSupabaseServer();
      if (orderId.startsWith("PKG-")) {
        await supabase
          .from("package_bookings")
          .update({
            payment_status: isPaid ? "paid" : "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_ref", orderId);
      } else {
        await supabase
          .from("bookings")
          .update({
            status: isPaid ? "confirmed" : "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_ref", orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("O");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  try {
    const ipnUrl = `${alfaConfig.ipnBaseUrl}/${alfaConfig.merchantId}/${alfaConfig.storeId}/${orderId}`;
    const statusRes = await fetch(ipnUrl);
    const status = await statusRes.json();

    const isPaid: boolean = status.TransactionStatus === "Paid";
    const bookingRef: string = status.TransactionReferenceNumber ?? orderId;

    if (bookingRef) {
      const supabase = await getSupabaseServer();
      if (bookingRef.startsWith("PKG-")) {
        await supabase
          .from("package_bookings")
          .update({
            payment_status: isPaid ? "paid" : "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_ref", bookingRef);
      } else {
        await supabase
          .from("bookings")
          .update({
            status: isPaid ? "confirmed" : "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_ref", bookingRef);
      }
    }

    return NextResponse.json({
      paid: isPaid,
      bookingRef,
      transactionId: status.TransactionId ?? null,
      amount: status.TransactionAmount ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
