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

export async function getMyTasks(teamId: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, title, status, priority, due_date, created_at, team_id, created_by, assignee_id, updated_at, deleted_at"
    )
    .eq("team_id", teamId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Task[];
}
