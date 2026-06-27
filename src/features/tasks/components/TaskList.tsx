import type { Task } from "@/types";
import { StatusSelect } from "./StatusSelect";

const priorityLabel: Record<string, string> = {
  urgent: "긴급",
  high: "높음",
  normal: "보통",
  low: "낮음",
};

const priorityColor: Record<string, string> = {
  urgent: "text-red-600",
  high: "text-orange-500",
  normal: "text-gray-400",
  low: "text-gray-300",
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks.length) {
    return (
      <p className="text-gray-400 text-sm py-12 text-center">
        태스크가 없어요. 첫 태스크를 추가해보세요.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg"
        >
          <StatusSelect taskId={task.id} currentStatus={task.status} />
          <span className="flex-1 text-sm text-gray-800">{task.title}</span>
          <span className={`text-xs font-medium ${priorityColor[task.priority]}`}>
            {priorityLabel[task.priority]}
          </span>
        </li>
      ))}
    </ul>
  );
}
