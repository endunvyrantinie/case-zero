import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/server/admin";

export const runtime = "nodejs";

function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || !signatures.length) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return signatures.some((signature) => {
    const actualBuffer = Buffer.from(signature, "utf8");
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });

    const signature = request.headers.get("stripe-signature") || "";
    const rawBody = await request.text();
    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

    const session = event.data?.object;
    const userId = session?.metadata?.user_id || session?.client_reference_id;
    const isCorrectPurchase = session?.payment_status === "paid" && session?.currency === "myr" && session?.amount_total === 690;
    if (!userId || !isCorrectPurchase) return NextResponse.json({ received: true });

    const admin = getAdminSupabase();
    const now = new Date().toISOString();
    const { error } = await admin.from("user_entitlements").upsert({
      user_id: userId,
      ad_free_lifetime: true,
      payment_provider: "stripe",
      payment_reference: session.id,
      purchased_at: now,
      updated_at: now
    }, { onConflict: "user_id" });

    if (error) {
      console.error("Stripe webhook entitlement update failed", error);
      return NextResponse.json({ error: "Could not save entitlement." }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return NextResponse.json({ error: "Webhook failed." }, { status: 500 });
  }
}
