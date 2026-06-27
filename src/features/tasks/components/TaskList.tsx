import type { Task } from "@/types";
import { StatusSelect } from "./StatusSelect";

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  urgent: { label: "🔥🔥 긴급", bg: "#fff3e0", text: "#e65100", border: "#ff6d00" },
  high:   { label: "🔥 높음",   bg: "#fff8f0", text: "#f57c00", border: "#ffb74d" },
  normal: { label: "✨ 보통",   bg: "#fffde7", text: "#f9a825", border: "#ffe082" },
  low:    { label: "💤 낮음",   bg: "#f5f5f5", text: "#9e9e9e", border: "#e0e0e0" },
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks.length) {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
            alt="파이리"
            width={80}
            height={80}
            className="opacity-50"
          />
        </div>
        <p className="text-sm font-black" style={{ color: "#ffb74d" }}>
          아직 태스크가 없어요!
        </p>
        <p className="text-xs mt-1" style={{ color: "#bcaaa4" }}>
          파이리가 심심해하고 있어요. 태스크를 추가해봐요 🔥
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {tasks.map((task) => {
        const p = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
        const isDone = task.status === "done" || task.status === "archived";

        return (
          <li
            key={task.id}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border transition-shadow hover:shadow-md"
            style={{
              borderColor: p.border,
              boxShadow: "0 1px 6px rgba(255,109,0,0.07)",
            }}
          >
            <StatusSelect taskId={task.id} currentStatus={task.status} />
            <span
              className={`flex-1 text-sm font-medium ${isDone ? "line-through opacity-40" : ""}`}
              style={{ color: "#3e2723" }}
            >
              {task.title}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: p.bg, color: p.text }}
            >
              {p.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
