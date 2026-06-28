import { BgDeco } from "@/components/ui/BgDeco";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LoginFormClient } from "./LoginFormClient";

export const metadata = { title: "로그인" };

const PIKACHU =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";
const CHARMANDER =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        /* ⚡ 전기 피카츄 테마 — 노란빛 전기 그라디언트 */
        background:
          "linear-gradient(135deg, #FFFEF0 0%, #FFF9C4 25%, #FFE57F 60%, #FFD740 100%)",
      }}
    >
      <BgDeco />

      {/* 피카츄 말풍선 — 좌상단 고정 */}
      <div
        className="pk-float"
        style={{
          position: "fixed", top: 16, left: 16, zIndex: 30,
          animationDuration: "2.2s", animationDelay: "0.5s",
        }}
      >
        <TransitionLink href="/" emoji="⚡">
          <div style={{
            background: "rgba(255,255,255,0.95)",
            border: "2px solid #FFD700",
            borderRadius: 14,
            padding: "6px 14px",
            fontSize: "0.78rem", fontWeight: 800,
            color: "#B8860B",
            boxShadow: "0 3px 14px rgba(255,193,7,0.35)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            ⚡ 홈으로 돌아가기
          </div>
        </TransitionLink>
        {/* 꼬리 — 오른쪽 아래 (피카츄 방향) */}
        <div style={{
          position: "absolute", bottom: -9, right: 14,
          width: 0, height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "9px solid #FFD700",
        }} />
        <div style={{
          position: "absolute", bottom: -6, right: 14,
          width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "7px solid rgba(255,255,255,0.95)",
        }} />
      </div>

      <div className="w-full max-w-sm relative" style={{ zIndex: 10 }}>
        {/* ── 헤더: 피카츄 메인, 파이리 조역 ── */}
        <div className="text-center mb-7">
          {/* 테마 배지 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA000)",
              color: "#fff",
              boxShadow: "0 2px 12px rgba(255,193,7,0.5)",
            }}
          >
            ⚡ 전기 타입 로그인
          </div>

          <div className="flex items-end justify-center gap-4 mb-4">
            {/* 피카츄 — 메인 (크게) */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PIKACHU}
                alt="피카츄"
                width={140}
                height={140}
                className="pk-float drop-shadow-2xl"
                style={{
                  animationDuration: "2.6s",
                  filter: "drop-shadow(0 10px 28px rgba(255,215,0,0.65))",
                }}
              />
              {/* 번개 후광 */}
              <span
                className="absolute pk-float"
                style={{
                  top: -8, right: -10, fontSize: "1.8rem",
                  animationDuration: "1.5s", filter: "drop-shadow(0 0 8px #FFD700)",
                }}
              >
                ⚡
              </span>
            </div>

            {/* 중앙 텍스트 */}
            <div className="pb-3 text-center">
              <div className="text-2xl font-black" style={{ color: "#B8860B", lineHeight: 1.1 }}>
                돌아왔군요
              </div>
              <div
                className="text-3xl font-black"
                style={{ color: "#F57F17", lineHeight: 1.1, textShadow: "0 2px 8px rgba(255,193,7,0.3)" }}
              >
                트레이너! 👋
              </div>
            </div>

            {/* 파이리 — 조역 (작게) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CHARMANDER}
              alt="파이리"
              width={72}
              height={72}
              className="pk-float mb-1"
              style={{
                animationDuration: "3.2s",
                animationDelay: "0.6s",
                opacity: 0.7,
                filter: "drop-shadow(0 6px 14px rgba(255,120,50,0.4))",
              }}
            />
          </div>

          <p className="text-sm font-bold" style={{ color: "#A16207" }}>
            ⚡ TaskFlow에 번개처럼 접속해요
          </p>
        </div>

        {/* ── 폼 카드 — 전기 테마 (노란 테두리) ── */}
        <div
          className="rounded-3xl p-8 border-2"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderColor: "#FFD700",
            boxShadow: "0 8px 36px rgba(255,215,0,0.25), 0 2px 8px rgba(255,160,0,0.15)",
          }}
        >
          <LoginFormClient serverError={error} />
        </div>
      </div>
    </main>
  );
}
