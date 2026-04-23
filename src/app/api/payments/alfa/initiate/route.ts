import { NextRequest, NextResponse } from "next/server";
import { alfaConfig } from "@/lib/alfa/config";
import { generateAlfaHash } from "@/lib/alfa/hash";
import { createBooking } from "@/services/booking.service.server";
import type { CreateBookingInput } from "@/types/booking";

interface InitiatePaymentBody {
  booking: CreateBookingInput;
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: InitiatePaymentBody = await req.json();
    const { booking, amount } = body;

    const summary = await createBooking(booking);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://traversepakistan.com";
    const returnUrl = `${siteUrl}/payments/alfa/return`;

    // Param order must match PHP reference exactly — hash is order-dependent
    const hsParams: Record<string, string> = {
      HS_ChannelId: alfaConfig.channelId,
      HS_IsRedirectionRequest: "0",
      HS_MerchantId: alfaConfig.merchantId,
      HS_StoreId: alfaConfig.storeId,
      HS_ReturnURL: returnUrl,
      HS_MerchantHash: alfaConfig.merchantHash,
      HS_MerchantUsername: alfaConfig.merchantUsername,
      HS_MerchantPassword: alfaConfig.merchantPassword,
      HS_TransactionReferenceNumber: summary.bookingRef,
    };

    const requestHash = generateAlfaHash(hsParams, alfaConfig.key1, alfaConfig.key2);

    // APG expects form-urlencoded, not JSON
    const hsFormBody = new URLSearchParams({ ...hsParams, HS_RequestHash: requestHash });
    const hsResponse = await fetch(alfaConfig.hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: hsFormBody.toString(),
    });

    const hsText = await hsResponse.text();
    let hsData: Record<string, string>;
    try {
      hsData = JSON.parse(hsText);
    } catch {
      console.error("[alfa/initiate] HS non-JSON response:", hsText.slice(0, 500));
      return NextResponse.json(
        { error: `Handshake returned unexpected response (HTTP ${hsResponse.status}): ${hsText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    if (!hsData.AuthToken) {
      return NextResponse.json(
        { error: hsData.ErrorMessage ?? "Handshake failed — no AuthToken returned" },
        { status: 502 }
      );
    }

    // PHP includes RequestHash="" (null) in the hash string before computing — order matters
    const ssoHashParams: Record<string, string> = {
      AuthToken: hsData.AuthToken,
      RequestHash: "",
      ChannelId: alfaConfig.channelId,
      Currency: "PKR",
      IsBIN: "0",
      ReturnURL: returnUrl,
      MerchantId: alfaConfig.merchantId,
      StoreId: alfaConfig.storeId,
      MerchantHash: alfaConfig.merchantHash,
      MerchantUsername: alfaConfig.merchantUsername,
      MerchantPassword: alfaConfig.merchantPassword,
      TransactionTypeId: "3",
      TransactionReferenceNumber: summary.bookingRef,
      TransactionAmount: String(amount),
    };

    const ssoHash = generateAlfaHash(ssoHashParams, alfaConfig.key1, alfaConfig.key2);

    return NextResponse.json({
      ssoUrl: alfaConfig.ssoUrl,
      ssoParams: { ...ssoHashParams, RequestHash: ssoHash },
      bookingRef: summary.bookingRef,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[alfa/initiate]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
