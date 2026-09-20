"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

declare global { interface Window { adsbygoogle?: unknown[]; } }

const ADSENSE_CLIENT = "ca-pub-3818857321969667";

type Placement = "home" | "case" | "result";

function slotFor(placement: Placement) {
  if (placement === "home") return process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  if (placement === "result") return process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT || process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT_CASE || process.env.NEXT_PUBLIC_ADSENSE_SLOT;
}

export default function AdBanner({
  adFree,
  compact = false,
  label = "ADVERTISEMENT",
  placement = "case"
}: {
  adFree: boolean;
  compact?: boolean;
  label?: string;
  placement?: Placement;
}) {
  const pushed = useRef(false);
  const slot = slotFor(placement);

  useEffect(() => {
    if (adFree || !slot || pushed.current) return;
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
        if (tries < 10) timer = window.setTimeout(pushAd, 450);
      }
    };

    const existing = document.querySelector<HTMLScriptElement>("script[data-casezero-adsense]");
    if (existing) {
      if (existing.dataset.loaded === "true") timer = window.setTimeout(pushAd, 100);
      else existing.addEventListener("load", pushAd, { once: true });
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.dataset.casezeroAdsense = "true";
      script.addEventListener("load", () => { script.dataset.loaded = "true"; pushAd(); }, { once: true });
      document.head.appendChild(script);
    }

    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, [adFree, slot]);

  if (adFree) return null;

  if (!slot) {
    return <aside className={`house-ad ${compact ? "compact" : ""}`}>
      <span>{label}</span><div><strong>INVESTIGATE WITHOUT INTERRUPTIONS</strong><small>Remove ads forever with one RM6.90 payment.</small></div><Link href="/upgrade">REMOVE ADS</Link>
    </aside>;
  }

  return <aside className={`adsense-wrap ${compact ? "compact" : ""}`} aria-label={label}>
    <span>{label}</span>
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </aside>;
}
