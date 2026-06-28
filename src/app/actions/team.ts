"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type ActionState = { ok?: boolean; error?: string };

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createTeam(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  if (!name || name.length < 2) return { error: "팀 이름은 2자 이상 입력해주세요." };
  if (name.length > 40) return { error: "팀 이름은 40자 이하로 입력해주세요." };

  const { data: existing } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { error: "이미 팀에 소속되어 있습니다." };

  const admin = adminClient();
  const { data: team, error: teamErr } = await admin
    .from("teams")
    .insert({ name, owner_id: user.id })
    .select("id")
    .single();
  if (teamErr || !team) return { error: "팀 생성에 실패했습니다." };

  const { error: memberErr } = await admin
    .from("members")
    .insert({ team_id: team.id, user_id: user.id, role: "owner" });
  if (memberErr) return { error: "팀 생성에 실패했습니다." };

  revalidatePath("/team");
  revalidatePath("/tasks");
  redirect("/team");
}

export async function addMember(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const teamId = (formData.get("team_id") as string)?.trim();
  if (!email) return { error: "이메일을 입력해주세요." };
  if (!teamId) return { error: "팀 정보가 없습니다." };

  const { data: myMember } = await supabase
    .from("members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();
  if (myMember?.role !== "owner") return { error: "팀장만 멤버를 추가할 수 있습니다." };

  const admin = adminClient();
  const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) return { error: "사용자 조회에 실패했습니다." };

  const target = users.find((u) => u.email?.toLowerCase() === email);
  if (!target) return { error: "해당 이메일로 가입된 계정이 없습니다." };
  if (target.id === user.id) return { error: "자기 자신은 추가할 수 없습니다." };

  const { data: existingMember } = await supabase
    .from("members")
    .select("id")
    .eq("team_id", teamId)
    .eq("user_id", target.id)
    .maybeSingle();
  if (existingMember) return { error: "이미 팀 멤버입니다." };

  const { error } = await admin
    .from("members")
    .insert({ team_id: teamId, user_id: target.id, role: "member" });
  if (error) return { error: "멤버 추가에 실패했습니다." };

  revalidatePath("/team");
  return { ok: true };
}

export async function removeMember(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const memberId = (formData.get("member_id") as string)?.trim();
  const teamId = (formData.get("team_id") as string)?.trim();
  if (!memberId || !teamId) return { error: "정보가 없습니다." };

  const { data: myMember } = await supabase
    .from("members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();
  if (myMember?.role !== "owner") return { error: "팀장만 멤버를 내보낼 수 있습니다." };

  const admin = adminClient();
  const { error } = await admin
    .from("members")
    .delete()
    .eq("id", memberId)
    .eq("team_id", teamId);
  if (error) return { error: "멤버 제거에 실패했습니다." };

  revalidatePath("/team");
  return { ok: true };
}

export async function updateMemberRole(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const memberId = (formData.get("member_id") as string)?.trim();
  const teamId = (formData.get("team_id") as string)?.trim();
  const role = formData.get("role") as string;
  if (!memberId || !teamId || !["owner", "member"].includes(role)) {
    return { error: "잘못된 요청입니다." };
  }

  const { data: myMember } = await supabase
    .from("members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();
  if (myMember?.role !== "owner") return { error: "팀장만 역할을 변경할 수 있습니다." };

  const admin = adminClient();
  const { error } = await admin
    .from("members")
    .update({ role })
    .eq("id", memberId)
    .eq("team_id", teamId);
  if (error) return { error: "역할 변경에 실패했습니다." };

  revalidatePath("/team");
  return { ok: true };
}
