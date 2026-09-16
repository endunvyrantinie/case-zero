"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

declare global { interface Window { adsbygoogle?: unknown[]; } }

export default function AdBanner({ adFree, compact = false, label = "ADVERTISEMENT" }: { adFree: boolean; compact?: boolean; label?: string }) {
  const pushed = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (adFree || !client || !slot || pushed.current) return;
    let cancelled = false;
    let timer: number | undefined;
    let tries = 0;
    const pushAd = () => {
      if (cancelled || pushed.current) return;
      tries += 1;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        if (tries < 8) timer = window.setTimeout(pushAd, 500);
      }
    };
    timer = window.setTimeout(pushAd, 250);
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, [adFree, client, slot]);

  if (adFree) return null;

  if (!client || !slot) {
    return <aside className={`house-ad ${compact ? "compact" : ""}`}>
      <span>{label}</span><div><strong>INVESTIGATE WITHOUT INTERRUPTIONS</strong><small>Remove ads forever with one RM6.90 payment.</small></div><Link href="/upgrade">REMOVE ADS</Link>
    </aside>;
  }

  return <aside className={`adsense-wrap ${compact ? "compact" : ""}`} aria-label={label}>
    <span>{label}</span>
    <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}
