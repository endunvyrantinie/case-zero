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

    const admin = getAdminSupabase();
    const { data: entitlement } = await admin.from("user_entitlements").select("ad_free_lifetime").eq("user_id", auth.user.id).maybeSingle();
    if (entitlement?.ad_free_lifetime) return NextResponse.json({ alreadyOwned: true, url: `${request.nextUrl.origin}/` });

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${request.nextUrl.origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${request.nextUrl.origin}/upgrade`);
    params.set("client_reference_id", auth.user.id);
    if (auth.user.email) params.set("customer_email", auth.user.email);
    params.set("line_items[0][price_data][currency]", "myr");
    params.set("line_items[0][price_data][unit_amount]", "690");
    params.set("line_items[0][price_data][product_data][name]", "CASE//ZERO — Ad-Free Lifetime");
    params.set("line_items[0][price_data][product_data][description]", "One-time RM6.90 payment. Removes CASE//ZERO ads permanently for this account.");
    params.set("line_items[0][quantity]", "1");
    params.set("metadata[user_id]", auth.user.id);

    const stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    const data = await stripe.json();
    if (!stripe.ok || !data.url) {
      console.error("Stripe checkout error", data);
      return NextResponse.json({ error: "Could not open payment checkout." }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }
}
