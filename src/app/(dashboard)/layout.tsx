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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <a href="/tasks" className="text-sm font-bold text-gray-900">
          TaskFlow
        </a>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-gray-900"
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
