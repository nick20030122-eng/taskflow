"use client";

import { useActionState } from "react";
import { updateTaskStatus, type StatusActionState } from "@/app/actions/tasks";
import type { Status } from "@/types";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo", label: "할 일" },
  { value: "in_progress", label: "진행 중" },
  { value: "done", label: "완료" },
  { value: "archived", label: "보관" },
];

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

  return (
    <form key={currentStatus} action={action}>
      <input type="hidden" name="task_id" value={taskId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={pending || isArchived}
        className="text-xs px-2 py-1 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {state?.error && (
        <p className="text-xs text-red-500 mt-0.5">{state.error}</p>
      )}
    </form>
  );
}
