"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const STATUS_OPTIONS = [
  { value: "all",         label: "전체" },
  { value: "todo",        label: "📌 할 일" },
  { value: "in_progress", label: "🔥 진행 중" },
  { value: "done",        label: "✅ 완료" },
];

const PRIORITY_OPTIONS = [
  { value: "all",    label: "전체" },
  { value: "urgent", label: "🔥🔥 긴급" },
  { value: "high",   label: "🔥 높음" },
  { value: "normal", label: "⚡ 보통" },
  { value: "low",    label: "💤 낮음" },
];

export function FilterBar({
  currentStatus,
  currentPriority,
}: {
  currentStatus?: string;
  currentPriority?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(`/tasks${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams]
  );

  const activeStatus = currentStatus ?? "all";
  const activePriority = currentPriority ?? "all";

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-black mr-1" style={{ color: "#b45309" }}>상태</span>
        {STATUS_OPTIONS.map((opt) => {
          const active = activeStatus === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter("status", opt.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: active ? "#fff9c4" : "rgba(255,255,255,0.6)",
                color: active ? "#c2410c" : "#6b7280",
                border: `1.5px solid ${active ? "#fbbf24" : "#e5e7eb"}`,
                boxShadow: active ? "0 2px 8px rgba(251,191,36,0.25)" : "none",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-black mr-1" style={{ color: "#b45309" }}>우선순위</span>
        {PRIORITY_OPTIONS.map((opt) => {
          const active = activePriority === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter("priority", opt.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: active ? "#fff3e0" : "rgba(255,255,255,0.6)",
                color: active ? "#e65100" : "#6b7280",
                border: `1.5px solid ${active ? "#ff8a65" : "#e5e7eb"}`,
                boxShadow: active ? "0 2px 8px rgba(255,138,101,0.2)" : "none",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
