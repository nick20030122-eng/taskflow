import { BgDeco } from "@/components/ui/BgDeco";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SignupFormClient } from "./SignupFormClient";

export const metadata = { title: "회원가입" };

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        /* 🔥 불꽃 파이리 테마 — 주황-빨강 그라디언트 */
        background:
          "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 25%, #FFAB76 55%, #FF5722 100%)",
      }}
    >
      <BgDeco />

      <div className="w-full max-w-sm relative" style={{ zIndex: 10 }}>
        {/* ── 헤더: 파이리 메인, 피카츄 조역 ── */}
        <div className="text-center mb-7">
          {/* 테마 배지 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #FF5722, #BF360C)",
              color: "#fff",
              boxShadow: "0 2px 12px rgba(255,87,34,0.5)",
            }}
          >
            🔥 불꽃 타입 회원가입
          </div>

          <div className="flex items-end justify-center gap-4 mb-4">
            {/* 피카츄 — 조역 (작게) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PIKACHU}
              alt="피카츄"
              width={72}
              height={72}
              className="pk-float mb-1"
              style={{
                animationDuration: "3s",
                animationDelay: "0.4s",
                opacity: 0.7,
                filter: "drop-shadow(0 6px 14px rgba(255,215,0,0.4))",
              }}
            />

            {/* 중앙 텍스트 */}
            <div className="pb-3 text-center">
              <div className="text-2xl font-black" style={{ color: "#BF360C", lineHeight: 1.1 }}>
                새로운 모험
              </div>
              <div
                className="text-3xl font-black"
                style={{ color: "#E64A19", lineHeight: 1.1, textShadow: "0 2px 8px rgba(255,87,34,0.3)" }}
              >
                시작! 🎉
              </div>
            </div>

            {/* 파이리 — 메인 + 말풍선 (컬럼 흐름: 말풍선 → 파이리) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* 말풍선: in-flow */}
              <div
                className="pk-float"
                style={{
                  position: "relative",
                  marginBottom: 4,
                  animationDuration: "2.2s",
                  animationDelay: "1.1s",
                }}
              >
                <TransitionLink href="/" emoji="🔥">
                  <div style={{
                    background: "rgba(255,255,255,0.96)",
                    border: "2px solid #FF7043",
                    borderRadius: 14,
                    padding: "6px 14px",
                    fontSize: "0.78rem", fontWeight: 800,
                    color: "#BF360C",
                    boxShadow: "0 3px 14px rgba(255,87,34,0.3)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}>
                    🔥 홈으로 돌아가기
                  </div>
                </TransitionLink>
                {/* 꼬리 — 파이리 방향(아래) */}
                <div style={{
                  position: "absolute", bottom: -9,
                  left: "50%", marginLeft: -7,
                  width: 0, height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "9px solid #FF7043",
                }} />
                <div style={{
                  position: "absolute", bottom: -6,
                  left: "50%", marginLeft: -5,
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "7px solid rgba(255,255,255,0.96)",
                }} />
              </div>

              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CHARMANDER}
                  alt="파이리"
                  width={140}
                  height={140}
                  className="pk-float drop-shadow-2xl"
                  style={{
                    animationDuration: "2.8s",
                    animationDelay: "0.2s",
                    filter: "drop-shadow(0 10px 28px rgba(255,87,34,0.65))",
                  }}
                />
                {/* 불꽃 후광 */}
                <span
                  className="absolute flame"
                  style={{
                    top: -8, left: -10, fontSize: "1.8rem",
                    filter: "drop-shadow(0 0 8px #FF5722)",
                  }}
                >
                  🔥
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm font-bold" style={{ color: "#7B2D00" }}>
            🔥 파이리와 함께 불타는 여정을 시작해요
          </p>
        </div>

        {/* ── 폼 카드 — 불꽃 테마 (주황 테두리) ── */}
        <div
          className="rounded-3xl p-8 border-2"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderColor: "#FF7043",
            boxShadow: "0 8px 36px rgba(255,87,34,0.22), 0 2px 8px rgba(255,120,50,0.15)",
          }}
        >
          <SignupFormClient serverError={error} />
        </div>
      </div>
    </main>
  );
}
