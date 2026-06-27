export type Status = "todo" | "in_progress" | "done" | "archived";
export type Priority = "urgent" | "high" | "normal" | "low";
export type Role = "owner" | "member";

export type Team = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export type Member = {
  id: string;
  team_id: string;
  user_id: string;
  role: Role;
  created_at: string;
};

export type Task = {
  id: string;
  team_id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
