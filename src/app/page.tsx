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
};

export default function Home() {
  return (
    <>
      <JsonLd data={appJsonLd} />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, #ffe0b2 0%, #fff8f0 50%, #fff3e0 100%)",
        }}
      >
        {/* 배경 불꽃 장식 */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute top-10 left-8 text-5xl opacity-20 flame">🔥</span>
          <span className="absolute top-32 right-12 text-3xl opacity-15 flame" style={{ animationDelay: "0.3s" }}>🔥</span>
          <span className="absolute bottom-20 left-16 text-4xl opacity-15 flame" style={{ animationDelay: "0.7s" }}>🔥</span>
          <span className="absolute bottom-10 right-8 text-6xl opacity-10 flame" style={{ animationDelay: "0.5s" }}>🔥</span>
        </div>

        <div className="text-center max-w-md relative z-10">
          {/* 파이리 이미지 */}
          <div className="relative inline-block mb-4">
            <div
              className="w-40 h-40 mx-auto rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)",
                boxShadow: "0 8px 40px rgba(255,109,0,0.35)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
                alt="파이리"
                width={120}
                height={120}
                className="drop-shadow-lg"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-3xl flame">🔥</span>
          </div>

          <h1
            className="text-4xl font-black mb-1 tracking-tight"
            style={{ color: "#e65100" }}
          >
            TaskFlow
          </h1>
          <p className="text-sm font-bold mb-1" style={{ color: "#ff6d00" }}>
            파이리처럼 불타오르는 생산성 🔥
          </p>
          <p className="text-sm mb-8" style={{ color: "#a1887f" }}>
            팀의 할 일을 한 화면에서 파악하고<br />하루를 활활 태워봐요!
          </p>

          <div className="flex flex-col gap-3 items-center">
            <a
              href="/login"
              className="w-60 py-3.5 rounded-2xl text-sm font-black text-white shadow-xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #ff6d00 0%, #ff3d00 100%)",
                boxShadow: "0 6px 24px rgba(255,109,0,0.4)",
              }}
            >
              🔥 불타게 시작하기
            </a>
            <a
              href="/signup"
              className="w-60 py-3.5 rounded-2xl text-sm font-black border-2 transition-all hover:scale-105"
              style={{
                color: "#ff6d00",
                borderColor: "#ffcc80",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              새 트레이너 등록
            </a>
          </div>

          <p className="mt-8 text-xs" style={{ color: "#bcaaa4" }}>
            #004 파이리 · Fire Type · TaskFlow
          </p>
        </div>
      </main>
    </>
  );
}
