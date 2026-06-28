"use client";

import { useActionState } from "react";
import { removeMember, updateMemberRole } from "@/app/actions/team";
import type { Role } from "@/types";

type ActionState = { ok?: boolean; error?: string };

type MemberWithEmail = {
  id: string;
  team_id: string;
  user_id: string;
  role: Role;
  email: string;
};

export function MemberRow({
  member,
  isMe,
  isOwner,
}: {
  member: MemberWithEmail;
  isMe: boolean;
  isOwner: boolean;
}) {
  const [removeState, removeAction, removePending] = useActionState<ActionState, FormData>(
    removeMember,
    {}
  );
  const [roleState, roleAction, rolePending] = useActionState<ActionState, FormData>(
    updateMemberRole,
    {}
  );

  const nextRole: Role = member.role === "owner" ? "member" : "owner";
  const roleLabel = member.role === "owner" ? "👑 팀장" : "👤 멤버";
  const roleToggleLabel = member.role === "owner" ? "↓ 멤버로" : "↑ 팀장으로";

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 rounded-2xl"
      style={{
        background: isMe ? "rgba(255,253,224,0.9)" : "rgba(255,255,255,0.72)",
        border: `1.5px solid ${isMe ? "#fbbf24" : "#f3f4f6"}`,
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: "1.4rem" }}>{member.role === "owner" ? "👑" : "👤"}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="text-sm font-bold truncate"
          style={{ color: "#3e2723" }}
        >
          {member.email}
          {isMe && (
            <span
              className="ml-2 text-xs font-black px-2 py-0.5 rounded-full"
              style={{ background: "#FFD700", color: "#B8860B" }}
            >
              나
            </span>
          )}
        </div>
        <div className="text-xs" style={{ color: "#9ca3af" }}>
          {roleLabel}
        </div>
      </div>

      {isOwner && !isMe && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 역할 변경 */}
          <form action={roleAction}>
            <input type="hidden" name="member_id" value={member.id} />
            <input type="hidden" name="team_id" value={member.team_id} />
            <input type="hidden" name="role" value={nextRole} />
            <button
              type="submit"
              disabled={rolePending}
              className="px-3 py-1 rounded-xl text-xs font-bold transition-all hover:scale-[1.04] disabled:opacity-50"
              style={{
                border: "1.5px solid #fbbf24",
                background: "#fffbeb",
                color: "#d97706",
              }}
            >
              {rolePending ? "..." : roleToggleLabel}
            </button>
          </form>

          {/* 내보내기 */}
          <form action={removeAction}>
            <input type="hidden" name="member_id" value={member.id} />
            <input type="hidden" name="team_id" value={member.team_id} />
            <button
              type="submit"
              disabled={removePending}
              className="px-3 py-1 rounded-xl text-xs font-bold transition-all hover:scale-[1.04] disabled:opacity-50"
              style={{
                border: "1.5px solid #fca5a5",
                background: "#fff5f5",
                color: "#dc2626",
              }}
            >
              {removePending ? "..." : "✕ 내보내기"}
            </button>
          </form>
        </div>
      )}

      {(removeState.error || roleState.error) && (
        <div className="text-xs mt-1" style={{ color: "#c2410c" }}>
          ⚠️ {removeState.error ?? roleState.error}
        </div>
      )}
    </div>
  );
}
