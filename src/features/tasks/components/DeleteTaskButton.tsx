"use client";

import { useActionState, useEffect } from "react";
import { deleteTask } from "@/app/actions/tasks";

type State = { ok?: boolean; error?: string };

export function DeleteTaskButton({
  taskId,
  onPendingChange,
}: {
  taskId: string;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [, action, pending] = useActionState<State, FormData>(deleteTask, {});

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  return (
    <form action={action}>
      <input type="hidden" name="task_id" value={taskId} />
      <button
        type="submit"
        disabled={pending}
        title={pending ? "삭제 중…" : "삭제"}
        className="flex items-center justify-center w-7 h-7 rounded-xl hover:scale-110 disabled:scale-100"
        style={{
          background: pending ? "#ffe4e4" : "#fff0f0",
          color: "#ef4444",
          border: "1.5px solid #fca5a5",
          transition: "background 0.2s",
        }}
      >
        <span
          className={pending ? "pk-spin" : ""}
          style={{ display: "inline-block", fontSize: "0.9rem" }}
        >
          🗑
        </span>
      </button>
    </form>
  );
}
