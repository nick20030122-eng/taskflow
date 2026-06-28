"use client";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">💧</div>
      <h2 className="text-lg font-black mb-2" style={{ color: "#e65100" }}>
        파이리가 당황했어요!
      </h2>
      <p className="text-sm mb-6" style={{ color: "#a1887f" }}>
        예기치 않은 오류가 발생했어요.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #ff6d00, #ff3d00)",
          boxShadow: "0 4px 16px rgba(255,109,0,0.35)",
        }}
      >
        🔥 다시 불태우기
      </button>
    </div>
  );
}
