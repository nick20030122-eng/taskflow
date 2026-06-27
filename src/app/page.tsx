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
    </>
  );
}
