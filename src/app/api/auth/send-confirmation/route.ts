import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getResend, buildConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; name?: string };
    const { email, name } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const redirectTo = `${origin}/auth/callback?next=/account/trips`;

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      options: { redirectTo },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const confirmUrl = data.properties?.action_link;
    if (!confirmUrl) {
      return NextResponse.json({ error: "Could not generate confirmation link" }, { status: 500 });
    }

    const resend = getResend();
    const template = buildConfirmationEmail(confirmUrl, name);
    await resend.emails.send({ to: email, ...template });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-confirmation]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
