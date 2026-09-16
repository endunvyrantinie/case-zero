"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabase() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.");
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}

export type CloudProgress = {
  user_id: string;
  case_id: string;
  solved: boolean;
  best_score: number;
  attempts: number;
  last_played_at: string | null;
  notes: string;
  chats: Record<string, { role: "player" | "suspect"; text: string }[]>;
  attempt_started_at: string | null;
  attempt_deadline_at: string | null;
  attempt_closed: boolean;
  updated_at: string;
};
