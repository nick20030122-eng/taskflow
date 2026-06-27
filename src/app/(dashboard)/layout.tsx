import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "#fff8f0" }}>
      <header
        className="sticky top-0 z-10 px-5 py-3 flex items-center justify-between border-b"
        style={{
          background: "linear-gradient(135deg, #ff6d00 0%, #ff3d00 100%)",
          borderColor: "#ff3d00",
        }}
      >
        <a href="/tasks" className="flex items-center gap-2">
          <span className="text-xl flame">🔥</span>
          <span className="text-base font-black text-white tracking-tight drop-shadow">
            TaskFlow
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
          >
            {user.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs font-bold transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
