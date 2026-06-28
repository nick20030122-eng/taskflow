"use client";

import { useState } from "react";
import type { Task } from "@/types";
import { StatusSelect } from "./StatusSelect";
import { DeleteTaskButton } from "./DeleteTaskButton";

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: "🔥🔥 긴급", bg: "#fff3e0", text: "#e65100",  border: "#ff8a65" },
  high:   { label: "🔥 높음",   bg: "#fff8f0", text: "#f57c00",  border: "#ffb74d" },
  normal: { label: "⚡ 보통",   bg: "#fffde7", text: "#b45309",  border: "#fbbf24" },
  low:    { label: "💤 낮음",   bg: "#f5f5f5", text: "#9e9e9e",  border: "#e0e0e0" },
};

export function TaskRow({ task }: { task: Task }) {
  const [statusPending, setStatusPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const isAnyPending = statusPending || deletePending;

  const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
  const isDone = task.status === "done" || task.status === "archived";
  const isUrgent = task.priority === "urgent";
  const isNormal = task.priority === "normal";

  return (
    <li
      className="flex items-center gap-3 p-3.5 rounded-2xl border"
      style={{
        background: isAnyPending ? "rgba(255,253,220,0.95)" : "rgba(255,255,255,0.75)",
        borderColor: isAnyPending ? "#fbbf24" : p.border,
        boxShadow: isAnyPending
          ? "0 0 0 3px rgba(251,191,36,0.22), 0 2px 12px rgba(255,180,50,0.18)"
          : "0 1px 8px rgba(255,180,50,0.08)",
        backdropFilter: "blur(4px)",
        transition: "background 0.22s, border-color 0.22s, box-shadow 0.22s",
      }}
    >
      {isUrgent && <span className="flame text-base" style={{ flexShrink: 0 }}>🔥</span>}
      {isNormal && <span className="pk-float text-base" style={{ flexShrink: 0, animationDuration: "2s" }}>⚡</span>}

      <StatusSelect
        taskId={task.id}
        currentStatus={task.status}
        onPendingChange={setStatusPending}
      />

      <span
        className={`flex-1 text-sm font-medium ${isDone ? "line-through opacity-40" : ""}`}
        style={{
          color: "#3e2723",
          opacity: isAnyPending && !isDone ? 0.55 : undefined,
          transition: "opacity 0.22s",
        }}
      >
        {task.title}
      </span>

      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ background: p.bg, color: p.text, border: `1.5px solid ${p.border}` }}
      >
        {p.label}
      </span>

      <DeleteTaskButton taskId={task.id} onPendingChange={setDeletePending} />
    </li>
  );
}
