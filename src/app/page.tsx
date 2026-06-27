import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  const connected = !error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>

      <div
        className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium ${
          connected
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        <span>{connected ? "✓" : "✗"}</span>
        <span>Supabase {connected ? "연결됨" : "연결 실패"}</span>
      </div>

      {!connected && (
        <p className="text-xs text-gray-400">{error?.message}</p>
      )}
    </div>
  );
}
