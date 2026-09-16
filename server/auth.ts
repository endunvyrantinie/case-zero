import "server-only";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

type AuthFailure = { error: string; status: 401 | 403 | 500 };
type AuthSuccess = { user: User; supabase: SupabaseClient; progress: any };


export async function getAuthenticatedUser(request: NextRequest): Promise<AuthFailure | { user: User; supabase: SupabaseClient }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: "Supabase is not configured.", status: 500 };
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { error: "Sign in required.", status: 401 };
  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: "Your session has expired. Sign in again.", status: 401 };
  return { user: data.user, supabase };
}

export async function getAuthenticatedGameSession(request: NextRequest, caseId: string): Promise<AuthFailure | AuthSuccess> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: "Supabase is not configured.", status: 500 };

  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { error: "Sign in required.", status: 401 };

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return { error: "Your session has expired. Sign in again.", status: 401 };

  const { data: progress, error: progressError } = await supabase
    .from("case_progress")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("case_id", caseId)
    .maybeSingle();

  if (progressError) return { error: "Could not read investigation progress.", status: 500 };
  if (!progress) return { error: "Start the case before interrogating suspects.", status: 403 };
  if (progress.attempt_closed) return { error: "This investigation attempt is closed. Start a new attempt.", status: 403 };

  const deadline = progress.attempt_deadline_at ? new Date(progress.attempt_deadline_at).getTime() : 0;
  if (!deadline || deadline <= Date.now()) return { error: "Time expired. Start a new 10-minute attempt.", status: 403 };

  return { user: userData.user, supabase, progress };
}
