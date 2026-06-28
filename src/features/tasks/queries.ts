import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types";

export async function getMyTeam(
  userId: string
): Promise<{ id: string; name: string } | null> {
  const supabase = await createClient();

  const { data: memberRow } = await supabase
    .from("members")
    .select("team_id")
    .eq("user_id", userId)
    .single();

  if (!memberRow) return null;

  const { data: team } = await supabase
    .from("teams")
    .select("id, name")
    .eq("id", memberRow.team_id)
    .single();

  return team;
}

const TASK_SELECT =
  "id, title, status, priority, due_date, created_at, team_id, created_by, assignee_id, updated_at, deleted_at";

export async function getMyTasks(
  teamId: string,
  filters?: { status?: string; priority?: string }
): Promise<Task[]> {
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("team_id", teamId)
    .is("deleted_at", null);

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status as never);
  }
  if (filters?.priority && filters.priority !== "all") {
    query = query.eq("priority", filters.priority as never);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Task[];
}

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export async function getTodayTasks(teamId: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("team_id", teamId)
    .is("deleted_at", null)
    .in("status", ["todo", "in_progress"])
    .order("created_at", { ascending: false });

  if (error) return [];
  const tasks = (data ?? []) as Task[];
  return tasks.sort((a, b) => {
    const pd =
      (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
    return pd !== 0
      ? pd
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
