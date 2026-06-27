"use client";

import { useActionState } from "react";
import { createTask } from "@/app/actions/tasks";

type ActionState = { error?: string };

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "🔥🔥 긴급" },
  { value: "high",   label: "🔥 높음" },
  { value: "normal", label: "✨ 보통" },
  { value: "low",    label: "💤 낮음" },
];

export function CreateTaskForm({ teamId }: { teamId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createTask,
    {}
  );

  return (
    <form action={action} className="mb-6">
      <input type="hidden" name="team_id" value={teamId} />
      <div
        className="bg-white rounded-2xl p-4 border"
        style={{
          borderColor: "#ffcc80",
          boxShadow: "0 2px 12px rgba(255,109,0,0.08)",
        }}
      >
        <input
          name="title"
          placeholder="오늘 불태울 태스크를 입력해봐요 🔥"
          maxLength={80}
          className="w-full text-sm bg-transparent focus:outline-none mb-3 placeholder-orange-200"
          style={{ color: "#3e2723" }}
        />
        <div className="flex items-center gap-2">
          <select
            name="priority"
            defaultValue="normal"
            className="flex-1 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none transition-colors"
            style={{
              border: "2px solid #ffe0b2",
              background: "#fff8f0",
              color: "#ff6d00",
            }}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-[1.04] disabled:opacity-50 disabled:scale-100"
            style={{
              background: "linear-gradient(135deg, #ff6d00, #ff3d00)",
              boxShadow: "0 3px 10px rgba(255,109,0,0.3)",
            }}
          >
            {pending ? "추가 중..." : "🔥 추가"}
          </button>
        </div>
      </div>
      {state?.error && (
        <p className="mt-2 text-xs flex items-center gap-1 pl-1" style={{ color: "#e65100" }}>
          <span>⚠️</span> {state.error}
        </p>
      )}
    </form>
  );
}
