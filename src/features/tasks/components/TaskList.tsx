import type { Task } from "@/types";
import { StatusSelect } from "./StatusSelect";

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: "🔥🔥 긴급", bg: "#fff3e0", text: "#e65100",  border: "#ff8a65" },
  high:   { label: "🔥 높음",   bg: "#fff8f0", text: "#f57c00",  border: "#ffb74d" },
  normal: { label: "⚡ 보통",   bg: "#fffde7", text: "#b45309",  border: "#fbbf24" },
  low:    { label: "💤 낮음",   bg: "#f5f5f5", text: "#9e9e9e",  border: "#e0e0e0" },
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks.length) {
    return (
      <div
        className="text-center py-14 rounded-3xl border"
        style={{
          background: "rgba(255,255,255,0.6)",
          borderColor: "#fbbf24",
        }}
      >
        <div className="flex items-end justify-center gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PIKACHU}
            alt="피카츄"
            width={64}
            height={64}
            className="opacity-55 pk-float"
            style={{ animationDuration: "3s" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CHARMANDER}
            alt="파이리"
            width={64}
            height={64}
            className="opacity-55 pk-float"
            style={{ animationDuration: "2.7s", animationDelay: "0.4s" }}
          />
        </div>
        <p className="text-sm font-black" style={{ color: "#d97706" }}>
          아직 태스크가 없어요!
        </p>
        <p className="text-xs mt-1" style={{ color: "#92400e" }}>
          피카츄와 파이리가 심심해해요 ⚡🔥
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {tasks.map((task) => {
        const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
        const isDone = task.status === "done" || task.status === "archived";
        const isUrgent = task.priority === "urgent";
        const isNormal = task.priority === "normal";

        return (
          <li
            key={task.id}
            className="flex items-center gap-3 p-3.5 rounded-2xl border transition-shadow hover:shadow-md"
            style={{
              background: "rgba(255,255,255,0.75)",
              borderColor: p.border,
              boxShadow: "0 1px 8px rgba(255,180,50,0.08)",
              backdropFilter: "blur(4px)",
            }}
          >
            {isUrgent && (
              <span className="flame text-base" style={{ flexShrink: 0 }}>🔥</span>
            )}
            {isNormal && (
              <span className="pk-float text-base" style={{ flexShrink: 0, animationDuration: "2s" }}>⚡</span>
            )}
            <StatusSelect taskId={task.id} currentStatus={task.status} />
            <span
              className={`flex-1 text-sm font-medium ${isDone ? "line-through opacity-40" : ""}`}
              style={{ color: "#3e2723" }}
            >
              {task.title}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: p.bg, color: p.text, border: `1.5px solid ${p.border}` }}
            >
              {p.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
