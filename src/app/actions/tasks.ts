"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { trackServerEvent } from "@/lib/events/track";
import { sendAlert } from "@/lib/events/alert";
import type { Status } from "@/types";

type ActionState = { ok?: boolean; error?: string };

export type StatusActionState = {
  ok: boolean;
  code: string;
  error?: string;
};

const VALID_STATUSES: Status[] = ["todo", "in_progress", "done", "archived"];

export async function createTask(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 1. 인증 확인 — getSession() 아닌 getUser() 사용
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  // 2. 입력 검증
  const title = (formData.get("title") as string)?.trim();
  const team_id = formData.get("team_id") as string;
  const priority = (formData.get("priority") as string) || "normal";

  if (!title) return { error: "태스크 제목을 입력해주세요." };
  if (title.length < 2) return { error: "제목은 2자 이상 입력해주세요." };
  if (title.length > 80) return { error: "제목은 80자 이하로 입력해주세요." };
  if (!team_id) return { error: "팀 정보가 없습니다." };

  // 3. INSERT — created_by는 서버에서 강제 (클라이언트 입력 신뢰 금지)
  const { error } = await supabase.from("tasks").insert({
    title,
    team_id,
    priority,
    created_by: user.id,
  });

  if (error) {
    await trackServerEvent("task.create_failed", { errorCode: "DB-500", operation: "createTask" }, user.id);
    await sendAlert("error", "태스크 생성 실패", { errorCode: "DB-500", operation: "createTask" });
    return { error: "태스크 생성에 실패했습니다." };
  }

  await trackServerEvent("task.created", { teamId: team_id }, user.id);

  // 4. 캐시 무효화
  revalidatePath("/tasks");
  return { ok: true };
}

export async function updateTaskStatus(
  _prevState: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  const supabase = await createClient();

  // ① 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      ok: false,
      code: "AUTH-401",
      error: "로그인이 필요합니다. 다시 로그인해 주세요.",
    };
  }

  const taskId = (formData.get("task_id") as string)?.trim();
  const newStatus = formData.get("status") as string;

  // ② 입력 검증
  if (!taskId) return { ok: false, code: "INPUT-422", error: "태스크 정보가 없습니다." };
  if (!VALID_STATUSES.includes(newStatus as Status)) {
    return { ok: false, code: "INPUT-422", error: "올바른 상태 값을 선택해 주세요." };
  }

  // ③ 대상 조회 — RLS가 타 팀 태스크를 자동 차단
  const { data: task } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("id", taskId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!task) {
    return {
      ok: false,
      code: "TASK-404",
      error: "태스크를 찾을 수 없습니다. 목록을 새로고침해 주세요.",
    };
  }

  // ④ 비즈니스 규칙 — archived 태스크는 변경 불가
  if (task.status === "archived") {
    return {
      ok: false,
      code: "RULE-409",
      error: "보관된 태스크는 상태를 변경할 수 없습니다.",
    };
  }

  // ⑤ UPDATE — 실제로 변경된 행을 확인 (거짓 성공 방지)
  const { data: updated, error } = await supabase
    .from("tasks")
    .update({ status: newStatus as Status })
    .eq("id", taskId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("TASK-STATUS-500", {
      op: "updateTaskStatus",
      taskId,
      dbError: error.message,
    });
    return {
      ok: false,
      code: "TASK-STATUS-500",
      error: "일시적 오류로 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (!updated) {
    return { ok: false, code: "TASK-404", error: "태스크를 찾을 수 없습니다." };
  }

  await trackServerEvent("task.status_updated", { taskId, toStatus: newStatus }, user.id);

  revalidatePath("/tasks");
  return { ok: true, code: "OK" };
}

export async function deleteTask(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const taskId = (formData.get("task_id") as string)?.trim();
  if (!taskId) return { error: "태스크 정보가 없습니다." };

  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", taskId)
    .is("deleted_at", null);

  if (error) return { error: "삭제에 실패했습니다." };

  revalidatePath("/tasks");
  return { ok: true };
}

export async function deleteAllTasks(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const teamId = (formData.get("team_id") as string)?.trim();
  if (!teamId) return { error: "팀 정보가 없습니다." };

  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("team_id", teamId)
    .is("deleted_at", null);

  if (error) return { error: "전체 삭제에 실패했습니다." };

  revalidatePath("/tasks");
  return { ok: true };
}
