import type { Task } from "@/types";
import { TaskRow } from "./TaskRow";

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

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
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </ul>
  );
}
