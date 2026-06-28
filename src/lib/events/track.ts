import { createClient } from "@/lib/supabase/server";

export type EventType =
  | "task.created"
  | "task.status_updated"
  | "task.create_failed";

export async function trackServerEvent(
  eventType: EventType,
  eventData: Record<string, unknown> = {},
  userId?: string
): Promise<void> {
  if (!userId) return;
  try {
    const supabase = await createClient();
    await supabase
      .from("activity_logs")
      .insert({ user_id: userId, event_type: eventType, event_data: eventData });
  } catch {
    // 로그 실패는 무시 — 핵심 기능에 영향 없어야 함
  }
}
