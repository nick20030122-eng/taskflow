"use client";

import { useActionState, useEffect, useState } from "react";
import { createTask } from "@/app/actions/tasks";

type ActionState = { ok?: boolean; error?: string };

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "🔥🔥 긴급" },
  { value: "high",   label: "🔥 높음" },
  { value: "normal", label: "⚡ 보통" },
  { value: "low",    label: "💤 낮음" },
];

export function CreateTaskForm({ teamId }: { teamId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createTask,
    {}
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.ok) setFormKey((k) => k + 1);
  }, [state.ok]);

  return (
    <form key={formKey} action={action} className="mb-5">
      <input type="hidden" name="team_id" value={teamId} />
      <div
        className="rounded-3xl p-4 border"
        style={{
          background: "rgba(255,255,255,0.75)",
          borderColor: "#fbbf24",
          boxShadow: "0 2px 14px rgba(255,180,50,0.13)",
          backdropFilter: "blur(8px)",
        }}
      >
        <input
          name="title"
          placeholder="⚡ 오늘 불태울 태스크를 입력해봐요 🔥"
          maxLength={80}
          className="w-full text-sm bg-transparent focus:outline-none mb-3"
          style={{ color: "#3e2723" }}
        />
        <div className="flex items-center gap-2">
          <select
            name="priority"
            defaultValue="normal"
            className="flex-1 px-3 py-2 rounded-2xl text-xs font-bold focus:outline-none transition-colors"
            style={{
              border: "2px solid #fde68a",
              background: "#fffbeb",
              color: "#d97706",
            }}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2 rounded-2xl text-xs font-black text-white transition-all hover:scale-[1.04] disabled:opacity-50 disabled:scale-100"
            style={{
              background: "linear-gradient(135deg, #FFB300, #FF6D00)",
              boxShadow: "0 3px 10px rgba(255,109,0,0.3)",
            }}
          >
            {pending ? "추가 중..." : "⚡ 추가 🔥"}
          </button>
        </div>
      </div>
      <div role="status" aria-live="polite" className="min-h-[1.25rem]">
        {state.ok && (
          <p className="mt-2 text-xs flex items-center gap-1 pl-1 font-bold" style={{ color: "#558b2f" }}>
            ✅ 추가됐어요!
          </p>
        )}
        {state.error && (
          <p className="mt-2 text-xs flex items-center gap-1 pl-1" style={{ color: "#c2410c" }}>
            <span>⚠️</span> {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
