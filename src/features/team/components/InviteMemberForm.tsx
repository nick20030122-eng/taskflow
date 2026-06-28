"use client";

import { useActionState, useEffect, useRef } from "react";
import { addMember } from "@/app/actions/team";

type ActionState = { ok?: boolean; error?: string };

export function InviteMemberForm({ teamId }: { teamId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addMember,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="mt-6">
      <input type="hidden" name="team_id" value={teamId} />
      <div
        className="rounded-3xl p-5 border"
        style={{
          background: "rgba(255,255,255,0.75)",
          borderColor: "#fbbf24",
          boxShadow: "0 2px 10px rgba(255,180,50,0.10)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="mb-3 text-xs font-black" style={{ color: "#B8860B" }}>
          👋 이메일로 멤버 초대
        </div>
        <div className="flex gap-2">
          <input
            name="email"
            type="email"
            placeholder="teammate@example.com"
            required
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm focus:outline-none"
            style={{
              border: "2px solid #fde68a",
              background: "#fffbeb",
              color: "#3e2723",
            }}
          />
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #FFB300, #FF6D00)",
              boxShadow: "0 3px 10px rgba(255,109,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            {pending ? "초대 중..." : "⚡ 초대"}
          </button>
        </div>
        <div role="status" aria-live="polite" className="min-h-[1.25rem] mt-2">
          {state.ok && (
            <p className="text-xs pl-1 font-bold" style={{ color: "#558b2f" }}>
              ✅ 멤버가 추가됐어요!
            </p>
          )}
          {state.error && (
            <p className="text-xs pl-1" style={{ color: "#c2410c" }}>
              ⚠️ {state.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
