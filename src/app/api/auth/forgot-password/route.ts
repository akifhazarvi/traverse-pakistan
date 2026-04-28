import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getResend, buildForgotPasswordEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email?: string };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const redirectTo = `${origin}/auth/callback?next=/auth/reset-password`;

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (error) {
      // Don't leak whether the email exists
      return NextResponse.json({ ok: true });
    }

    const resetUrl = data.properties?.action_link;
    if (!resetUrl) return NextResponse.json({ ok: true });

    const resend = getResend();
    const template = buildForgotPasswordEmail(resetUrl);
    await resend.emails.send({ to: email, ...template });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
