"use client";

import { useActionState, useState } from "react";
import { deleteAllTasks } from "@/app/actions/tasks";

type State = { ok?: boolean; error?: string };

export function DeleteAllButton({ teamId }: { teamId: string }) {
  const [, action, pending] = useActionState<State, FormData>(deleteAllTasks, {});
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
        style={{ background: "#fff0f0", color: "#ef4444", border: "1.5px solid #fca5a5" }}
      >
        🗑 전체 삭제
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-bold" style={{ color: "#ef4444" }}>정말요?</span>
      <form action={action} style={{ display: "contents" }}>
        <input type="hidden" name="team_id" value={teamId} />
        <button
          type="submit"
          disabled={pending}
          className="text-xs font-black px-3 py-1.5 rounded-xl text-white transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
        >
          {pending ? "삭제 중…" : "삭제"}
        </button>
      </form>
      <button
        onClick={() => setConfirming(false)}
        className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
        style={{ background: "#f5f5f5", color: "#6b7280", border: "1.5px solid #e5e7eb" }}
      >
        취소
      </button>
    </div>
  );
}
