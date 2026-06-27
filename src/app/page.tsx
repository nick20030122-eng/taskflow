import { JsonLd } from "@/components/seo/JsonLd";
import { BgDeco } from "@/components/ui/BgDeco";
import { TransitionLink } from "@/components/ui/TransitionLink";

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

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

export default function Home() {
  return (
    <>
      <JsonLd data={appJsonLd} />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFF8D6 0%, #FFE66D 28%, #FFD4A3 62%, #FF8E53 100%)",
        }}
      >
        {/* 풍부한 배경 장식 */}
        <BgDeco />

        {/* 콘텐츠 (z-index로 배경 위에) */}
        <div className="text-center max-w-lg relative" style={{ zIndex: 10 }}>
          {/* ── 두 캐릭터 ── */}
          <div className="flex items-end justify-center gap-10 mb-8">
            {/* 피카츄 */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PIKACHU}
                alt="피카츄"
                width={180}
                height={180}
                className="pk-float drop-shadow-2xl"
                style={{
                  animationDuration: "3s",
                  filter: "drop-shadow(0 12px 32px rgba(255,220,80,0.55))",
                }}
              />
              <span
                className="absolute -bottom-3 -left-4 text-3xl pk-float"
                style={{ animationDelay: "0.3s", animationDuration: "2s" }}
              >
                ⚡
              </span>
            </div>

            {/* 중앙 로고 */}
            <div className="flex flex-col items-center pb-4">
              <span className="text-xs font-black mb-1" style={{ color: "#b45309" }}>
                ✨ & ✨
              </span>
              <h1
                className="text-5xl font-black leading-tight"
                style={{ color: "#e65100", letterSpacing: "-1px" }}
              >
                Task<br />Flow
              </h1>
            </div>

            {/* 파이리 */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CHARMANDER}
                alt="파이리"
                width={180}
                height={180}
                className="pk-float drop-shadow-2xl"
                style={{
                  animationDuration: "2.7s",
                  animationDelay: "0.5s",
                  filter: "drop-shadow(0 12px 32px rgba(255,120,50,0.55))",
                }}
              />
              <span className="absolute -bottom-3 -right-4 text-3xl flame">🔥</span>
            </div>
          </div>

          {/* 캐치프레이즈 */}
          <p className="text-lg font-black mb-2" style={{ color: "#c2410c" }}>
            ⚡ 피카츄처럼 빠르게, 🔥 파이리처럼 불타게!
          </p>
          <p className="text-sm mb-10" style={{ color: "#92400e" }}>
            팀의 할 일을 한 화면에서 파악하고<br />
            오늘 하루를 활활 태워봐요!
          </p>

          {/* 버튼 */}
          <div className="flex flex-col gap-3 items-center">
            <TransitionLink
              href="/login"
              emoji="⚡"
              className="w-72 py-4 rounded-2xl text-sm font-black text-white shadow-xl transition-all hover:scale-105 text-center block"
              style={{
                background: "linear-gradient(135deg, #FFB300 0%, #FF6D00 60%, #FF3D00 100%)",
                boxShadow: "0 8px 28px rgba(255,109,0,0.45)",
              }}
            >
              ⚡ 빠르게 불태우러가기 🔥
            </TransitionLink>
            <TransitionLink
              href="/signup"
              emoji="🔥"
              className="w-72 py-4 rounded-2xl text-sm font-black border-2 transition-all hover:scale-105 text-center block"
              style={{
                color: "#c2410c",
                borderColor: "#fbbf24",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              새 트레이너 등록
            </TransitionLink>
          </div>

          <p className="mt-10 text-xs" style={{ color: "#b45309" }}>
            #025 피카츄 ⚡ · #004 파이리 🔥 · TaskFlow
          </p>
        </div>
      </main>
    </>
  );
}
