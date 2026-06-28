import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyTeam, getTodayTasks, getMyTasks } from "@/features/tasks/queries";
import { TaskList } from "@/features/tasks/components/TaskList";

export const metadata = { title: "오늘 할 일" };

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const team = await getMyTeam(user.id);
  if (!team) redirect("/tasks");

  const focusTasks = await getTodayTasks(team.id);
  const allTasks = await getMyTasks(team.id);

  const inProgress = focusTasks.filter((t) => t.status === "in_progress");
  const todo = focusTasks.filter((t) => t.status === "todo");
  const doneCount = allTasks.filter((t) => t.status === "done").length;
  const totalCount = allTasks.length;
  const urgentCount = focusTasks.filter((t) => t.priority === "urgent").length;

  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const allDone = focusTasks.length === 0;

  return (
    <div className="pk-slide-up">
      {/* 헤더 카드 */}
      <div
        className="mb-6 rounded-3xl p-5"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "2px solid rgba(251,191,36,0.45)",
          boxShadow: "0 6px 24px rgba(255,180,50,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-black flex items-center gap-2 mb-1" style={{ color: "#c2410c" }}>
              <span className="pk-float" style={{ display: "inline-block", animationDuration: "2.5s" }}>⚡</span>
              오늘 할 일
            </h1>
            <p className="text-xs font-bold mb-3" style={{ color: "#92400e" }}>
              {team.name} · 집중할 태스크 {focusTasks.length}개
              {urgentCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full" style={{ background: "#fff3e0", color: "#e65100" }}>
                  🔥🔥 긴급 {urgentCount}개
                </span>
              )}
            </p>

            {/* 진행률 바 */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2.5 rounded-full overflow-hidden"
                style={{ background: "#f5e6c8" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, #FFD700, #FF6D00)",
                    boxShadow: progressPct > 0 ? "0 0 8px rgba(255,180,50,0.5)" : "none",
                  }}
                />
              </div>
              <span className="text-xs font-black" style={{ color: "#c2410c", minWidth: 36 }}>
                {progressPct}%
              </span>
            </div>
            <div className="text-xs mt-1 font-medium" style={{ color: "#92400e" }}>
              전체 {totalCount}개 중 {doneCount}개 완료
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PIKACHU}
            alt="피카츄"
            width={72}
            height={72}
            className="pk-float ml-4"
            style={{
              animationDuration: "2.6s",
              filter: "drop-shadow(0 4px 12px rgba(255,200,50,0.4))",
            }}
          />
        </div>
      </div>

      {allDone ? (
        <div
          className="text-center py-16 rounded-3xl border"
          style={{ background: "rgba(255,255,255,0.6)", borderColor: "#aed581" }}
        >
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-black text-lg mb-1" style={{ color: "#558b2f" }}>
            오늘 할 일을 모두 마쳤어요!
          </p>
          <p className="text-sm" style={{ color: "#92400e" }}>
            피카츄가 기뻐하고 있어요 ⚡
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PIKACHU}
            alt="피카츄"
            width={96}
            height={96}
            className="pk-float mx-auto mt-4"
            style={{ animationDuration: "2s", filter: "drop-shadow(0 6px 16px rgba(255,200,50,0.5))" }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {inProgress.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flame" style={{ display: "inline-block", fontSize: "1rem" }}>🔥</span>
                <h2 className="text-sm font-black" style={{ color: "#e65100" }}>
                  진행 중 ({inProgress.length})
                </h2>
              </div>
              <TaskList tasks={inProgress} />
            </section>
          )}

          {todo.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <span style={{ fontSize: "1rem" }}>📌</span>
                <h2 className="text-sm font-black" style={{ color: "#b45309" }}>
                  할 일 ({todo.length})
                </h2>
                {todo.some((t) => t.priority === "urgent") && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#fff3e0", color: "#e65100" }}>
                    긴급 포함
                  </span>
                )}
              </div>
              <TaskList tasks={todo} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
