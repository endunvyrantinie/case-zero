import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/server/auth";
import { getAdminSupabase } from "@/server/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Payment setup is not configured yet." }, { status: 503 });
    const { sessionId } = await request.json() as { sessionId?: string };
    if (!sessionId || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });

    const stripe = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await stripe.json();
    if (!stripe.ok) return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
    const correctUser = data.client_reference_id === auth.user.id || data.metadata?.user_id === auth.user.id;
    if (data.payment_status !== "paid" || !correctUser || data.currency !== "myr" || data.amount_total !== 690) {
      return NextResponse.json({ error: "Payment has not been confirmed for this account." }, { status: 403 });
    }

    const admin = getAdminSupabase();
    const now = new Date().toISOString();
    const { error } = await admin.from("user_entitlements").upsert({
      user_id: auth.user.id,
      ad_free_lifetime: true,
      payment_provider: "stripe",
      payment_reference: sessionId,
      purchased_at: now,
      updated_at: now
    }, { onConflict: "user_id" });
    if (error) { console.error(error); return NextResponse.json({ error: "Payment succeeded, but the unlock could not be saved." }, { status: 500 }); }
    return NextResponse.json({ adFree: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
  }
}
