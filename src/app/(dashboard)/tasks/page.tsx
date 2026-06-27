import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyTeam, getMyTasks } from "@/features/tasks/queries";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { TaskList } from "@/features/tasks/components/TaskList";

export const metadata = { title: "태스크 목록" };

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
        <div className="text-5xl mb-4">🏝️</div>
        <p className="font-black text-lg mb-1" style={{ color: "#e65100" }}>
          소속된 팀이 없어요
        </p>
        <p className="text-sm" style={{ color: "#a1887f" }}>
          팀 생성 기능은 다음 버전에서 제공됩니다.
        </p>
      </div>
    );
  }

  const tasks = await getMyTasks(team.id);
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: "#e65100" }}>
            <span className="flame">🔥</span>
            {team.name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#a1887f" }}>
            총 {tasks.length}개 · 완료 {doneCount}개
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
          alt="파이리"
          width={56}
          height={56}
          className="opacity-80"
        />
      </div>

      <CreateTaskForm teamId={team.id} />
      <TaskList tasks={tasks} />
    </div>
  );
}
