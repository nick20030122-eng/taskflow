import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { CreateTeamForm } from "@/features/team/components/CreateTeamForm";
import { InviteMemberForm } from "@/features/team/components/InviteMemberForm";
import { MemberRow } from "@/features/team/components/MemberRow";
import type { Member } from "@/types";

export const metadata = { title: "팀 관리" };

type MemberWithEmail = Member & { email: string };

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myMember } = await supabase
    .from("members")
    .select("id, team_id, user_id, role, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!myMember) {
    return (
      <div className="pk-slide-up">
        <div
          className="mb-6 rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "2px solid rgba(251,191,36,0.45)",
            boxShadow: "0 6px 24px rgba(255,180,50,0.18)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "#c2410c" }}>
            <span className="pk-float" style={{ display: "inline-block", animationDuration: "2.5s" }}>👥</span>
            팀 관리
          </h1>
          <p className="text-xs font-bold mb-5" style={{ color: "#92400e" }}>
            아직 소속된 팀이 없어요. 팀을 만들어서 시작해요!
          </p>
          <CreateTeamForm />
        </div>
      </div>
    );
  }

  const teamId = myMember.team_id;

  const [{ data: team }, { data: membersRaw }] = await Promise.all([
    supabase.from("teams").select("id, name, owner_id, created_at").eq("id", teamId).single(),
    supabase.from("members").select("id, team_id, user_id, role, created_at").eq("team_id", teamId),
  ]);

  if (!team || !membersRaw) redirect("/login");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });

  const emailMap = new Map(users.map((u) => [u.id, u.email ?? ""]));

  const members: MemberWithEmail[] = (membersRaw as Member[]).map((m) => ({
    ...m,
    email: emailMap.get(m.user_id) ?? m.user_id,
  }));

  const isOwner = myMember.role === "owner";

  return (
    <div className="pk-slide-up">
      {/* 헤더 카드 */}
      <div
        className="mb-6 rounded-3xl p-5"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "2px solid rgba(251,191,36,0.45)",
          boxShadow: "0 6px 24px rgba(255,180,50,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "#c2410c" }}>
          <span className="pk-float" style={{ display: "inline-block", animationDuration: "2.5s" }}>👥</span>
          팀 관리
        </h1>
        <p className="text-xs font-bold" style={{ color: "#92400e" }}>
          {team.name} · 멤버 {members.length}명
          {isOwner && (
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs"
              style={{ background: "#FFD700", color: "#B8860B" }}
            >
              팀장
            </span>
          )}
        </p>
      </div>

      {/* 멤버 목록 */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1.5px solid rgba(251,191,36,0.35)",
          boxShadow: "0 3px 14px rgba(255,180,50,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-xs font-black mb-3" style={{ color: "#B8860B" }}>
          팀원 목록
        </div>
        {members.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            isMe={m.user_id === user.id}
            isOwner={isOwner}
          />
        ))}
      </div>

      {/* 초대 폼 (팀장만) */}
      {isOwner && <InviteMemberForm teamId={teamId} />}
    </div>
  );
}
