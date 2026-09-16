"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { useEntitlement } from "@/lib/entitlement";

export default function UpgradePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { adFree } = useEntitlement(session);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeUpgrade();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function closeUpgrade() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  async function buy() {
    if (!session) {
      window.location.href = "/login?next=/upgrade";
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  return (
    <main className="upgrade-shell">
      <section className="upgrade-card panel" role="dialog" aria-modal="true" aria-label="Remove ads lifetime upgrade">
        <button className="upgrade-close" type="button" onClick={closeUpgrade} aria-label="Close remove ads screen">×</button>
        <div className="upgrade-crown">♛</div>
        <div className="eyebrow">ONE-TIME UPGRADE</div>
        <h1>Investigate without ads.</h1>
        <div className="lifetime-price">
          <strong>RM6.90</strong>
          <span>LIFETIME · ONE PAYMENT</span>
        </div>
        <div className="upgrade-benefits">
          <span>✓ Remove all CASE//ZERO ads</span>
          <span>✓ Unlimited cases remain included</span>
          <span>✓ Unlock follows your signed-in account</span>
          <span>✓ No subscription and no renewal</span>
        </div>
        {adFree ? (
          <div className="success-message">AD-FREE LIFETIME IS ALREADY ACTIVE ON THIS ACCOUNT.</div>
        ) : (
          <button className="primary upgrade-buy" onClick={buy} disabled={busy}>
            {busy ? "OPENING CHECKOUT..." : "REMOVE ADS FOREVER — RM6.90"}
          </button>
        )}
        <button className="upgrade-not-now" type="button" onClick={closeUpgrade}>NOT NOW</button>
        {error && <div className="error auth-message">{error}</div>}
        <small>Payment is handled securely by Stripe Checkout.</small>
      </section>
    </main>
  );
}
