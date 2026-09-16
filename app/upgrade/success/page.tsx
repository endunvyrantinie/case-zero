"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function UpgradeSuccessPage() {
  const [state, setState] = useState<"checking"|"ok"|"error">("checking");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    async function verify() {
      const sessionId = new URLSearchParams(window.location.search).get("session_id");
      const { data } = await getSupabase().auth.getSession();
      if (!data.session) { window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname + window.location.search); return; }
      if (!sessionId) { setState("error"); setMessage("Missing checkout session."); return; }
      const res = await fetch("/api/billing/verify", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify({ sessionId }) });
      const result = await res.json();
      if (res.ok && result.adFree) { setState("ok"); setMessage("Ad-free lifetime has been activated for your detective account."); }
      else { setState("error"); setMessage(result.error || "Could not verify the purchase."); }
    }
    verify();
  }, []);

  return <main className="upgrade-shell"><section className="upgrade-card panel"><div className="upgrade-crown">{state === "ok" ? "✓" : state === "error" ? "!" : "…"}</div><div className="eyebrow">PAYMENT STATUS</div><h1>{state === "ok" ? "Ads removed." : state === "error" ? "Verification issue" : "Checking payment"}</h1><p>{message}</p>{state !== "checking" && <Link className="primary link-button upgrade-return" href="/">RETURN TO CASE LIBRARY</Link>}</section></main>;
}
