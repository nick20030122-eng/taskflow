"use client";

import { useActionState } from "react";
import { createTeam } from "@/app/actions/team";

type ActionState = { ok?: boolean; error?: string };

export function CreateTeamForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createTeam,
    {}
  );

  return (
    <form action={action}>
      <div
        className="rounded-3xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.82)",
          borderColor: "#fbbf24",
          boxShadow: "0 2px 14px rgba(255,180,50,0.13)",
          backdropFilter: "blur(8px)",
          maxWidth: 420,
        }}
      >
        <div className="mb-4 text-sm font-black" style={{ color: "#B8860B" }}>
          ⚡ 팀 이름을 정해요
        </div>
        <input
          name="name"
          placeholder="스타트업 팀 이름 (2~40자)"
          maxLength={40}
          required
          className="w-full px-4 py-3 rounded-2xl text-sm bg-transparent focus:outline-none mb-3"
          style={{
            border: "2px solid #fde68a",
            background: "#fffbeb",
            color: "#3e2723",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full px-5 py-3 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
          style={{
            background: "linear-gradient(135deg, #FFB300, #FF6D00)",
            boxShadow: "0 3px 10px rgba(255,109,0,0.3)",
          }}
        >
          {pending ? "생성 중..." : "🔥 팀 만들기"}
        </button>
        <div role="status" aria-live="polite" className="min-h-[1.25rem] mt-2">
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
