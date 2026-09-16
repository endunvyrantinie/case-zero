"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export function useEntitlement(session: Session | null) {
  const [adFree, setAdFree] = useState(false);
  const [loadingEntitlement, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!session) { if (mounted) { setAdFree(false); setLoading(false); } return; }
      const { data } = await getSupabase().from("user_entitlements")
        .select("ad_free_lifetime")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (mounted) { setAdFree(Boolean(data?.ad_free_lifetime)); setLoading(false); }
    }
    setLoading(true);
    load();
    return () => { mounted = false; };
  }, [session?.user.id]);

  return { adFree, loadingEntitlement, setAdFree };
}
