"use client";

import { useActionState } from "react";
import { updateTaskStatus, type StatusActionState } from "@/app/actions/tasks";
import type { Status } from "@/types";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo",        label: "📌 할 일" },
  { value: "in_progress", label: "🔥 진행 중" },
  { value: "done",        label: "✅ 완료" },
  { value: "archived",    label: "📦 보관" },
];

const STATUS_STYLE: Record<Status, { bg: string; color: string; border: string }> = {
  todo:        { bg: "#fffde7", color: "#b45309",  border: "#fbbf24" },
  in_progress: { bg: "#fff3e0", color: "#e65100",  border: "#ff8a65" },
  done:        { bg: "#f1f8e9", color: "#558b2f",  border: "#aed581" },
  archived:    { bg: "#f5f5f5", color: "#9e9e9e",  border: "#e0e0e0" },
};

export function StatusSelect({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: Status;
}) {
  const [state, action, pending] = useActionState<StatusActionState, FormData>(
    updateTaskStatus,
    { ok: true, code: "" }
  );

  const isArchived = currentStatus === "archived";
  const style = STATUS_STYLE[currentStatus] ?? STATUS_STYLE.todo;

  return (
    <form key={currentStatus} action={action}>
      <input type="hidden" name="task_id" value={taskId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={pending || isArchived}
        className="text-xs font-bold px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: style.bg,
          color: style.color,
          border: `2px solid ${style.border}`,
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {state?.error && (
        <p className="text-xs mt-1" style={{ color: "#c2410c" }}>
          ⚠️ {state.error}
        </p>
      )}
    </form>
  );
}
