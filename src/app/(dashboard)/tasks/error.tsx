"use client";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-lg font-bold text-gray-900 mb-2">문제가 발생했어요</h2>
      <p className="text-sm text-gray-500 mb-4">
        {error.message || "예기치 않은 오류입니다."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700"
      >
        다시 시도
      </button>
    </div>
  );
}
