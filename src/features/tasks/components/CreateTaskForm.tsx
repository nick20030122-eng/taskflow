"use client";

import { useActionState } from "react";
import { createTask } from "@/app/actions/tasks";

type ActionState = { error?: string };

export function CreateTaskForm({ teamId }: { teamId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createTask,
    {}
  );

  return (
    <form action={action} className="mb-6 space-y-2">
      <input type="hidden" name="team_id" value={teamId} />
      <div className="flex gap-2">
        <input
          name="title"
          placeholder="새 태스크 입력... (2~80자)"
          maxLength={80}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          name="priority"
          defaultValue="normal"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="urgent">긴급</option>
          <option value="high">높음</option>
          <option value="normal">보통</option>
          <option value="low">낮음</option>
        </select>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "추가 중..." : "추가"}
        </button>
      </div>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
