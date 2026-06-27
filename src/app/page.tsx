import { createClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/JsonLd";

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TaskFlow",
  description:
    "5~20인 스타트업 팀의 PM이 태스크 우선순위를 한 화면에서 파악하고 하루를 시작하는 협업 도구",
  url: "https://taskflow.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ko",
  // aggregateRating: 실제 리뷰가 쌓이면 그때 추가
  // offers: 가격 정책이 확정되면 그때 추가
};

export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();
  const connected = !error;

  return (
    <>
      <JsonLd data={appJsonLd} />
      <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50 px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TaskFlow</h1>
          <p className="text-lg text-gray-600">
            5~20인 스타트업 팀의 PM이 태스크 우선순위를 한 화면에서 파악하고
            하루를 시작하는 협업 도구
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            시작하기
          </a>
          <a
            href="/signup"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            회원가입
          </a>
        </div>

        {/* 개발 환경 연결 상태 확인 */}
        {process.env.NODE_ENV === "development" && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
              connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <span>{connected ? "✓" : "✗"}</span>
            <span>Supabase {connected ? "연결됨" : "연결 실패"}</span>
            {!connected && <span>— {error?.message}</span>}
          </div>
        )}
      </main>
    </>
  );
}
