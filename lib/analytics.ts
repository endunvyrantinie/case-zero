import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export type AnalyticsEvent =
  | "dashboard_view"
  | "case_opened"
  | "evidence_reviewed"
  | "suspect_questioned"
  | "accusation_submitted"
  | "attempt_restarted"
  | "sound_enabled"
  | "upgrade_viewed";

export function trackEvent(
  session: Session | null,
  eventName: AnalyticsEvent,
  properties: Record<string, string | number | boolean | null> = {}
) {
  if (!session) return;
  getSupabase()
    .from("analytics_events")
    .insert({
      user_id: session.user.id,
      event_name: eventName,
      case_id: typeof properties.case_id === "string" ? properties.case_id : null,
      properties
    })
    .then(() => undefined);
}
