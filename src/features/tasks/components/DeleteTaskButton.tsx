"use client";

import { useActionState } from "react";
import { deleteTask } from "@/app/actions/tasks";

type State = { ok?: boolean; error?: string };

export function DeleteTaskButton({ taskId }: { taskId: string }) {
  const [, action, pending] = useActionState<State, FormData>(deleteTask, {});

  return (
    <form action={action}>
      <input type="hidden" name="task_id" value={taskId} />
      <button
        type="submit"
        disabled={pending}
        title="삭제"
        className="flex items-center justify-center w-7 h-7 rounded-xl transition-all hover:scale-110 disabled:opacity-40 disabled:scale-100"
        style={{ background: "#fff0f0", color: "#ef4444", border: "1.5px solid #fca5a5" }}
      >
        {pending ? "…" : "🗑"}
      </button>
    </form>
  );
}
