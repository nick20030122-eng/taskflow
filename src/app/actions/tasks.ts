"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string };

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

  if (error) return { error: "태스크 생성에 실패했습니다." };

  // 4. 캐시 무효화
  revalidatePath("/tasks");
  return {};
}
