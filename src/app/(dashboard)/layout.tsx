import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { BgDeco } from "@/components/ui/BgDeco";

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
    <div
      className="flex min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #FFF8D6 0%, #FFE66D 20%, #FFD4A3 55%, #FF8E53 100%)",
      }}
    >
      <BgDeco />
      <Sidebar email={user.email ?? ""} />

      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh", padding: "36px 32px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
