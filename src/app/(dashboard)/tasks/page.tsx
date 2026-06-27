import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyTeam, getMyTasks } from "@/features/tasks/queries";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { TaskList } from "@/features/tasks/components/TaskList";

export const metadata = { title: "태스크 목록" };

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const team = await getMyTeam(user.id);

  if (!team) {
    return (
      <div className="text-center py-20">
        <div className="flex items-end justify-center gap-4 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PIKACHU}     alt="피카츄" width={70} height={70} className="opacity-50 pk-float" style={{ animationDuration: "3s" }} />
          <span className="text-5xl mb-2">🏝️</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CHARMANDER} alt="파이리" width={70} height={70} className="opacity-50 pk-float" style={{ animationDuration: "2.7s", animationDelay: "0.4s" }} />
        </div>
        <p className="font-black text-lg mb-1" style={{ color: "#e65100" }}>소속된 팀이 없어요</p>
        <p className="text-sm" style={{ color: "#92400e" }}>팀 생성 기능은 다음 버전에서 제공됩니다.</p>
      </div>
    );
  }

  const tasks = await getMyTasks(team.id);
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className="pk-slide-up">
      {/* 팀 헤더 카드 */}
      <div
        className="mb-6 rounded-3xl p-5 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "2px solid rgba(251,191,36,0.45)",
          boxShadow: "0 6px 24px rgba(255,180,50,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <h1 className="text-xl font-black flex items-center gap-2 mb-1.5" style={{ color: "#c2410c" }}>
            <span className="pk-float" style={{ display: "inline-block", animationDuration: "2.5s" }}>⚡</span>
            {team.name}
            <span className="flame" style={{ display: "inline-block" }}>🔥</span>
          </h1>
          <div className="flex items-center gap-3 text-xs font-bold" style={{ color: "#92400e" }}>
            <span>전체 {tasks.length}개</span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: "#fff3e0", color: "#e65100" }}>
              🔥 진행 {inProgressCount}개
            </span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: "#f1f8e9", color: "#558b2f" }}>
              ✅ 완료 {doneCount}개
            </span>
          </div>
        </div>

        {/* 두 포켓몬 — 크게 */}
        <div className="flex items-end gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PIKACHU}
            alt="피카츄"
            width={72}
            height={72}
            className="pk-float"
            style={{
              animationDuration: "2.8s",
              filter: "drop-shadow(0 4px 12px rgba(255,200,50,0.4))",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CHARMANDER}
            alt="파이리"
            width={72}
            height={72}
            className="pk-float"
            style={{
              animationDuration: "3.2s",
              animationDelay: "0.5s",
              filter: "drop-shadow(0 4px 12px rgba(255,120,50,0.4))",
            }}
          />
        </div>
      </div>

      <CreateTaskForm teamId={team.id} />
      <TaskList tasks={tasks} />
    </div>
  );
}
