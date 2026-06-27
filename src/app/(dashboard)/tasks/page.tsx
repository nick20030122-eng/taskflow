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

  // layout.tsx에서 미인증을 처리하지만 타입 안전성을 위해 재확인
  if (!user) redirect("/login");

  const team = await getMyTeam(user.id);

  if (!team) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-sm mb-4">소속된 팀이 없습니다.</p>
        <p className="text-gray-400 text-xs">팀 생성 기능은 다음 버전에서 제공됩니다.</p>
      </div>
    );
  }

  const tasks = await getMyTasks(team.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{team.name} — 태스크</h1>
        <p className="text-sm text-gray-400 mt-1">{tasks.length}개의 태스크</p>
      </div>

      <CreateTaskForm teamId={team.id} />
      <TaskList tasks={tasks} />
    </div>
  );
}
