import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // ① 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ② 관리자 권한 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/tasks");

  // ③ 24시간 기준 타임스탬프
  const since24h = new Date(Date.now() - 86400 * 1000).toISOString();

  // ④ 4지표 병렬 조회
  const [teamsResult, tasksResult, eventsResult, errorsResult] = await Promise.all([
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since24h),
    supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true })
      .like("event_type", "%_error")
      .gte("created_at", since24h),
  ]);

  // ⑤ 최근 이벤트 목록 (24h, 최신 10개)
  const { data: recentEvents } = await supabase
    .from("activity_logs")
    .select("id, user_id, event_type, event_data, created_at")
    .gte("created_at", since24h)
    .order("created_at", { ascending: false })
    .limit(10);

  const totalTeams = teamsResult.count ?? 0;
  const totalTasks = tasksResult.count ?? 0;
  const events24h = eventsResult.count ?? 0;
  const errors24h = errorsResult.count ?? 0;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">관리자 콘솔</h1>

      {/* 섹션 1: 플랫폼 현황 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">플랫폼 현황</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="총 팀 수" value={totalTeams} unit="팀" />
          <StatCard label="활성 태스크" value={totalTasks} unit="개" />
          <StatCard label="24h 이벤트" value={events24h} unit="건" />
          <StatCard label="24h 오류" value={errors24h} unit="건" alert={errors24h > 0} />
        </div>
      </section>

      {/* 섹션 2: 최근 이벤트 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">최근 이벤트 (24h)</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {recentEvents && recentEvents.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">시각</th>
                  <th className="px-4 py-2 text-left">유형</th>
                  <th className="px-4 py-2 text-left">데이터</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentEvents.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(log.created_at as string).toLocaleTimeString("ko-KR")}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          (log.event_type as string).includes("error")
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.event_type as string}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500 truncate max-w-xs">
                      {JSON.stringify(log.event_data)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-4 py-8 text-center text-gray-400">최근 24시간 이벤트 없음</p>
          )}
        </div>
      </section>

      {/* 섹션 3: 시스템 상태 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">시스템 상태</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className={errors24h === 0 ? "text-green-500" : "text-red-500"}>●</span>
              오류율 (24h): {events24h > 0 ? `${((errors24h / events24h) * 100).toFixed(1)}%` : "0%"}
              {errors24h > 0 && (
                <span className="text-red-600 font-medium">— 조치 필요</span>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              데이터베이스: 정상
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              인증 서비스: 정상
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  unit,
  alert = false,
}: {
  label: string;
  value: number;
  unit: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-4 ${alert ? "border-l-4 border-red-500" : ""}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${alert ? "text-red-600" : "text-gray-900"}`}>
        {value}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}
