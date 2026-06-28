"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════
   타입 & 상수
══════════════════════════════════════════════ */
type PageId = "home" | "pikachu" | "charmander" | "play";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  dx: number;
}

const SPRITE = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const NAV: { id: PageId; label: string; icon: string }[] = [
  { id: "home",       label: "홈",    icon: "🏠" },
  { id: "pikachu",    label: "피카츄", icon: "⚡" },
  { id: "charmander", label: "파이리", icon: "🔥" },
  { id: "play",       label: "플레이", icon: "🎮" },
];

const PIKACHU_STATS = [
  { label: "HP",      value: 35, color: "#4ade80", emoji: "❤️" },
  { label: "공격",    value: 55, color: "#fb923c", emoji: "⚔️" },
  { label: "방어",    value: 40, color: "#60a5fa", emoji: "🛡️" },
  { label: "특수공격", value: 50, color: "#a78bfa", emoji: "✨" },
  { label: "특수방어", value: 50, color: "#f472b6", emoji: "💫" },
  { label: "스피드",  value: 90, color: "#fbbf24", emoji: "⚡" },
];

const CHARMANDER_STATS = [
  { label: "HP",      value: 39, color: "#4ade80", emoji: "❤️" },
  { label: "공격",    value: 52, color: "#fb923c", emoji: "⚔️" },
  { label: "방어",    value: 43, color: "#60a5fa", emoji: "🛡️" },
  { label: "특수공격", value: 60, color: "#a78bfa", emoji: "✨" },
  { label: "특수방어", value: 50, color: "#f472b6", emoji: "💫" },
  { label: "스피드",  value: 65, color: "#ff8e53", emoji: "🔥" },
];

const PIKACHU_FACTS = [
  { icon: "⚡", text: "전기를 뺨에 저장해요" },
  { icon: "🌍", text: "꼬리로 땅에 방전해요" },
  { icon: "📖", text: "전국도감 No.025" },
  { icon: "🏷️", text: "타입: 전기" },
  { icon: "🎤", text: "특기: 백만볼트, 아이언테일" },
];

const CHARMANDER_FACTS = [
  { icon: "🔥", text: "꼬리 불꽃이 건강 지표예요" },
  { icon: "🌧️", text: "비가 오면 힘들어해요" },
  { icon: "📖", text: "전국도감 No.004" },
  { icon: "🏷️", text: "타입: 불꽃" },
  { icon: "⚔️", text: "특기: 화염방사, 용의분노" },
];

/* ══════════════════════════════════════════════
   서브 컴포넌트들
══════════════════════════════════════════════ */

/** 배경 장식 이모지 (다층 구성) */
function BgDeco() {
  /* left/right 둘 다 명시적으로 선언해 TypeScript 타입 오류 방지 */
  const floaters: { emoji: string; top: string; left?: string; right?: string; size: string; op: number; delay: string; dur: string }[] = [
    /* ── 주요 ⚡🔥 크게 ── */
    { emoji:"⚡", top:"7%",  left:"5%",              size:"3rem",   op:0.22, delay:"0s",    dur:"2.8s" },
    { emoji:"🔥", top:"10%",              right:"7%", size:"2.8rem", op:0.20, delay:"0.5s", dur:"3.2s" },
    { emoji:"⚡", top:"44%", left:"2%",              size:"2.4rem", op:0.16, delay:"1s",    dur:"3.5s" },
    { emoji:"🔥", top:"60%",              right:"4%", size:"2.6rem", op:0.18, delay:"0.3s", dur:"2.6s" },
    { emoji:"⚡", top:"82%", left:"7%",              size:"2.8rem", op:0.15, delay:"0.5s", dur:"2.9s" },
    { emoji:"🔥", top:"80%",              right:"9%", size:"2.4rem", op:0.16, delay:"1.1s", dur:"3.4s" },
    /* ── 별/반짝임 드리프트 ── */
    { emoji:"✨", top:"20%", left:"22%",             size:"2rem",   op:0.16, delay:"0.7s", dur:"5.2s" },
    { emoji:"💫", top:"33%",              right:"18%",size:"1.8rem", op:0.14, delay:"1.3s", dur:"4.8s" },
    { emoji:"🌟", top:"55%", left:"18%",             size:"1.7rem", op:0.13, delay:"0.3s", dur:"5.5s" },
    { emoji:"💛", top:"70%",              right:"22%",size:"1.9rem", op:0.14, delay:"1.8s", dur:"4.6s" },
    { emoji:"⭐", top:"15%", left:"45%",             size:"1.5rem", op:0.12, delay:"2s",   dur:"6s"   },
    { emoji:"✨", top:"88%", left:"40%",             size:"1.4rem", op:0.11, delay:"0.9s", dur:"5.8s" },
    /* ── 소형 포인트 ── */
    { emoji:"⚡", top:"28%",              right:"32%",size:"1.3rem", op:0.10, delay:"2.4s", dur:"4.2s" },
    { emoji:"🔥", top:"50%", left:"37%",             size:"1.2rem", op:0.09, delay:"1.6s", dur:"3.9s" },
    { emoji:"💫", top:"75%", left:"55%",             size:"1.3rem", op:0.09, delay:"3s",   dur:"5s"   },
    { emoji:"🌟", top:"40%", left:"60%",             size:"1.1rem", op:0.08, delay:"2.8s", dur:"4.5s" },
    { emoji:"💛", top:"92%",              right:"55%",size:"1.2rem", op:0.09, delay:"1.4s", dur:"5.3s" },
    { emoji:"✨", top:"62%",              right:"45%",size:"1rem",   op:0.08, delay:"3.5s", dur:"4.8s" },
  ];

  return (
    <>
      {floaters.map((item, i) => (
        <span
          key={i}
          className={i < 12 ? "pk-float" : "pk-drift"}
          style={{
            position: "fixed",
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            opacity: item.op,
            pointerEvents: "none",
            zIndex: 0,
            animationDelay: item.delay,
            animationDuration: item.dur,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </>
  );
}

/** 페이지 전환 플래시 오버레이 — 대형 3중 링 + 전면 산란 */
function TransitionFlash({ emoji }: { emoji: string }) {
  const isThunder = emoji === "⚡";

  /* 결정적(deterministic) 위치 계산 — sin/cos 기반으로 hydration 안전 */
  const ring1 = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * 360,
    radius: 130,
    size: 1.6 + (i % 3) * 0.55,
    delay: 0.02 + (i % 4) * 0.016,
  }));
  const ring2 = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * 360 + 13,
    radius: 240,
    size: 1.2 + (i % 4) * 0.45,
    delay: 0.06 + (i % 5) * 0.013,
  }));
  const ring3 = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * 360 + 9,
    radius: 370,
    size: 0.9 + (i % 3) * 0.35,
    delay: 0.11 + (i % 6) * 0.01,
  }));
  /* 전면 산란 — 16×4 격자 기반 (결정적) */
  const scatter = Array.from({ length: 36 }, (_, i) => ({
    left: `${(i % 9) * 11.5 + Math.sin(i * 1.4) * 4 + 2}%`,
    top:  `${Math.floor(i / 9) * 23 + Math.cos(i * 0.85) * 7 + 4}%`,
    size: 0.85 + (i % 6) * 0.32,
    delay: (i % 12) * 0.017,
    dur:  0.3 + (i % 7) * 0.035,
  }));

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        animation: "pk-flash 0.62s ease forwards",
        background: isThunder
          ? "radial-gradient(circle at 50% 50%, rgba(255,230,109,0.92) 0%, rgba(255,210,80,0.45) 38%, rgba(255,240,160,0.12) 68%, transparent 82%)"
          : "radial-gradient(circle at 50% 50%, rgba(255,100,50,0.88) 0%, rgba(255,140,70,0.45) 38%, rgba(255,190,110,0.12) 68%, transparent 82%)",
      }}
    >
      {/* ── 중앙 초대형 이모지 ── */}
      <span
        style={{
          position: "absolute",
          fontSize: "9rem",
          lineHeight: 1,
          animation: "pk-mega-flash 0.62s cubic-bezier(0.34,1.4,0.64,1) forwards",
          zIndex: 2,
          filter: `drop-shadow(0 0 48px ${isThunder ? "#FFE066" : "#FF6B35"}) drop-shadow(0 0 80px ${isThunder ? "#FFD700" : "#FF3D00"})`,
        }}
      >
        {emoji}
      </span>

      {/* ── 1링 (반경 130px) ── */}
      {ring1.map((item, i) => (
        <span
          key={`r1-${i}`}
          style={{
            position: "absolute",
            fontSize: `${item.size}rem`,
            opacity: 0,
            animation: "pk-ring-item 0.62s ease forwards",
            animationDelay: `${item.delay}s`,
            transform: `rotate(${item.angle}deg) translateY(-${item.radius}px)`,
          }}
        >
          {emoji}
        </span>
      ))}

      {/* ── 2링 (반경 240px) ── */}
      {ring2.map((item, i) => (
        <span
          key={`r2-${i}`}
          style={{
            position: "absolute",
            fontSize: `${item.size}rem`,
            opacity: 0,
            animation: "pk-ring-item 0.62s ease forwards",
            animationDelay: `${item.delay}s`,
            transform: `rotate(${item.angle}deg) translateY(-${item.radius}px)`,
          }}
        >
          {emoji}
        </span>
      ))}

      {/* ── 3링 (반경 370px) ── */}
      {ring3.map((item, i) => (
        <span
          key={`r3-${i}`}
          style={{
            position: "absolute",
            fontSize: `${item.size}rem`,
            opacity: 0,
            animation: "pk-ring-item 0.62s ease forwards",
            animationDelay: `${item.delay}s`,
            transform: `rotate(${item.angle}deg) translateY(-${item.radius}px)`,
          }}
        >
          {emoji}
        </span>
      ))}

      {/* ── 전면 산란 ── */}
      {scatter.map((item, i) => (
        <span
          key={`s-${i}`}
          style={{
            position: "absolute",
            left: item.left,
            top: item.top,
            fontSize: `${item.size}rem`,
            opacity: 0,
            animation: `pk-scatter-pop ${item.dur}s ease forwards`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/** 파티클 */
function FloatingParticle({ p }: { p: Particle }) {
  return (
    <span
      style={{
        position: "fixed",
        left: p.x,
        top: p.y,
        fontSize: "1.4rem",
        pointerEvents: "none",
        zIndex: 200,
        animation: "pk-particle-up 0.9s ease forwards",
        transform: `translateX(${p.dx}px)`,
      }}
    >
      {p.emoji}
    </span>
  );
}

/** 상단 네비게이션 */
function Navbar({ current, onNav }: { current: PageId; onNav: (p: PageId) => void }) {
  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "10px 16px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "2px solid rgba(255,230,109,0.4)",
        boxShadow: "0 2px 20px rgba(255,180,50,0.15)",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* 로고 */}
        <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#e65100", letterSpacing: "-0.5px" }}>
          <span className="pk-float" style={{ animationDuration: "2.5s", display: "inline-block", marginRight: 4 }}>⚡</span>
          PokéFlow
          <span className="pk-float" style={{ animationDuration: "2s", animationDelay: "0.4s", display: "inline-block", marginLeft: 4 }}>🔥</span>
        </div>

        {/* 메뉴 */}
        <div style={{ display: "flex", gap: 6 }}>
          {NAV.map((item) => {
            const active = item.id === current;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                style={{
                  position: "relative",
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "2px solid",
                  borderColor: active ? (item.id === "pikachu" ? "#fbbf24" : item.id === "charmander" ? "#ff8e53" : item.id === "play" ? "#a78bfa" : "#fbbf24") : "transparent",
                  background: active
                    ? item.id === "pikachu" ? "#fff9c4"
                      : item.id === "charmander" ? "#fff3e0"
                      : item.id === "play" ? "#ede9fe"
                      : "#fff9c4"
                    : "transparent",
                  color: active ? "#1a1a1a" : "#6b6b6b",
                  fontWeight: active ? 800 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  animation: active ? "pk-pulse 2s infinite" : "none",
                }}
              >
                {active && (
                  <span style={{
                    position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                    fontSize: "0.9rem",
                    animation: "pk-float 1.5s ease-in-out infinite",
                  }}>
                    {item.id === "pikachu" ? "⚡" : item.id === "charmander" ? "🔥" : item.id === "play" ? "🎯" : "⭐"}
                  </span>
                )}
                {item.icon} {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/** 스탯 바 */
function StatBar({ label, value, color, emoji, loaded }: {
  label: string; value: number; color: string; emoji: string; loaded: boolean;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#555" }}>
          {emoji} {label}
        </span>
        <span style={{ fontSize: "0.78rem", fontWeight: 900, color }}>{value}</span>
      </div>
      <div style={{ height: 10, background: "#f0f0f0", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: loaded ? `${value}%` : "0%",
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            borderRadius: 999,
            transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)",
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   페이지들
══════════════════════════════════════════════ */

/** 홈 페이지 */
function HomePage({ onNav }: { onNav: (p: PageId) => void }) {
  return (
    <div className="pk-slide-up">
      {/* 타이틀 */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: "1rem", color: "#ff8e53", fontWeight: 700, marginBottom: 8 }}>
          ✨ PokéFlow에 오신 걸 환영해요! ✨
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#2d1b00", lineHeight: 1.2 }}>
          안녕하세요, 트레이너!<br />
          <span style={{ color: "#e65100" }}>⚡파이리&피카츄🔥</span>와<br />
          함께해요
        </h1>
      </div>

      {/* 캐릭터 카드 2개 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* 피카츄 카드 */}
        <button
          onClick={() => onNav("pikachu")}
          style={{
            background: "linear-gradient(135deg, #fff9c4, #fff3e0)",
            borderRadius: 24,
            padding: "24px 16px",
            border: "3px solid #FFE66D",
            boxShadow: "0 4px 20px rgba(255,230,109,0.35)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            textAlign: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) rotate(-1deg)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,230,109,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,230,109,0.35)"; }}
        >
          <div className="pk-float" style={{ animationDuration: "2.8s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SPRITE(25)} alt="피카츄" width={100} height={100} style={{ margin: "0 auto", display: "block" }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#b45309", marginTop: 8 }}>
            ⚡ 피카츄
          </div>
          <div style={{ fontSize: "0.72rem", color: "#92400e", marginTop: 4 }}>
            No.025 · 전기 타입
          </div>
          <div style={{
            marginTop: 10, padding: "4px 12px", borderRadius: 999,
            background: "#FFE66D", color: "#78350f", fontSize: "0.7rem", fontWeight: 700,
            display: "inline-block",
          }}>
            소개 보기 →
          </div>
        </button>

        {/* 파이리 카드 */}
        <button
          onClick={() => onNav("charmander")}
          style={{
            background: "linear-gradient(135deg, #fff3e0, #ffe0cc)",
            borderRadius: 24,
            padding: "24px 16px",
            border: "3px solid #FF8E53",
            boxShadow: "0 4px 20px rgba(255,142,83,0.3)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            textAlign: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) rotate(1deg)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,142,83,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,142,83,0.3)"; }}
        >
          <div className="pk-float" style={{ animationDuration: "3.2s", animationDelay: "0.5s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SPRITE(4)} alt="파이리" width={100} height={100} style={{ margin: "0 auto", display: "block" }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#c2410c", marginTop: 8 }}>
            🔥 파이리
          </div>
          <div style={{ fontSize: "0.72rem", color: "#9a3412", marginTop: 4 }}>
            No.004 · 불꽃 타입
          </div>
          <div style={{
            marginTop: 10, padding: "4px 12px", borderRadius: 999,
            background: "#FF8E53", color: "white", fontSize: "0.7rem", fontWeight: 700,
            display: "inline-block",
          }}>
            소개 보기 →
          </div>
        </button>
      </div>

      {/* 하단 배너 */}
      <div style={{
        background: "linear-gradient(135deg, #fff9c4, #fff3e0)",
        borderRadius: 20,
        padding: "20px 24px",
        border: "2px solid #FFE66D",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 16px rgba(255,230,109,0.2)",
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "#92400e" }}>
            🎮 미니게임 도전하기!
          </div>
          <div style={{ fontSize: "0.8rem", color: "#a16207", marginTop: 4 }}>
            ⚡와 🔥 중 누가 더 강할까요?
          </div>
        </div>
        <button
          onClick={() => onNav("play")}
          style={{
            padding: "10px 20px", borderRadius: 999,
            background: "linear-gradient(135deg, #FFE66D, #FF8E53)",
            border: "none", color: "#3e2723", fontWeight: 900,
            fontSize: "0.85rem", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255,142,83,0.4)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          게임 시작 →
        </button>
      </div>
    </div>
  );
}

/** 포켓몬 소개 공통 카드 */
function PokemonInfoPage({
  id, name, number, type, typeColor, accentColor, borderColor,
  bgGradient, stats, facts, loaded,
}: {
  id: number; name: string; number: string; type: string;
  typeColor: string; accentColor: string; borderColor: string;
  bgGradient: string; stats: typeof PIKACHU_STATS;
  facts: typeof PIKACHU_FACTS; loaded: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="pk-slide-up">
      {/* 헤더 카드 */}
      <div style={{
        background: bgGradient,
        borderRadius: 28, padding: "28px 24px",
        border: `3px solid ${borderColor}`,
        boxShadow: `0 8px 32px ${borderColor}55`,
        marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <div
          className="pk-float"
          style={{ animationDuration: "3s", flexShrink: 0 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPRITE(id)}
            alt={name}
            width={140}
            height={140}
            className={hovered ? "pk-wiggle" : ""}
            style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }}
          />
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: accentColor, marginBottom: 4 }}>
            전국도감 {number}
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a0a00", margin: 0 }}>
            {name}
          </h2>
          <span style={{
            display: "inline-block", marginTop: 8, padding: "4px 14px",
            borderRadius: 999, background: typeColor,
            color: "white", fontSize: "0.75rem", fontWeight: 700,
          }}>
            {type} 타입
          </span>
          <div style={{ fontSize: "0.78rem", color: "#78350f", marginTop: 8, opacity: 0.8 }}>
            이미지에 마우스를 올려보세요 👆
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* 스탯 카드 */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px",
          border: `2px solid ${borderColor}55`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "#374151", marginBottom: 14 }}>
            📊 기본 능력치
          </div>
          {stats.map((s) => (
            <StatBar key={s.label} {...s} loaded={loaded} />
          ))}
        </div>

        {/* 특징 카드 */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px",
          border: `2px solid ${borderColor}55`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "#374151", marginBottom: 14 }}>
            💡 특징 & 정보
          </div>
          {facts.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 12, marginBottom: 6,
                background: i % 2 === 0 ? "#fafafa" : "white",
                border: "1px solid #f0f0f0",
                fontSize: "0.82rem", color: "#374151",
                animation: `pk-slide-up ${0.3 + i * 0.08}s ease forwards`,
                opacity: loaded ? 1 : 0,
                transition: `opacity ${0.3 + i * 0.08}s`,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PikachuPage({ statsLoaded }: { statsLoaded: boolean }) {
  return (
    <PokemonInfoPage
      id={25} name="피카츄" number="No.025" type="전기"
      typeColor="#fbbf24" accentColor="#d97706" borderColor="#FFE66D"
      bgGradient="linear-gradient(135deg, #fff9c4, #fef3c7, #fff3e0)"
      stats={PIKACHU_STATS} facts={PIKACHU_FACTS} loaded={statsLoaded}
    />
  );
}

function CharmanderPage({ statsLoaded }: { statsLoaded: boolean }) {
  return (
    <PokemonInfoPage
      id={4} name="파이리" number="No.004" type="불꽃"
      typeColor="#f97316" accentColor="#c2410c" borderColor="#FF8E53"
      bgGradient="linear-gradient(135deg, #fff3e0, #ffe0cc, #ffd0b5)"
      stats={CHARMANDER_STATS} facts={CHARMANDER_FACTS} loaded={statsLoaded}
    />
  );
}

/** 미니게임 페이지 */
function PlayPage({
  pikachuScore, charmanderScore, onPikachu, onCharmander,
}: {
  pikachuScore: number;
  charmanderScore: number;
  onPikachu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCharmander: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const total = pikachuScore + charmanderScore;
  const pkPct = total === 0 ? 50 : Math.round((pikachuScore / total) * 100);
  const cmPct = 100 - pkPct;
  const winner = pikachuScore > charmanderScore ? "pikachu" : charmanderScore > pikachuScore ? "charmander" : "tie";

  return (
    <div className="pk-slide-up">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1a0a00" }}>
          ⚡ 대결! 피카츄 vs 파이리 🔥
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#78350f", marginTop: 4 }}>
          응원하는 포켓몬을 클릭해서 점수를 올려봐요!
        </p>
      </div>

      {/* 점수판 */}
      <div style={{
        background: "white", borderRadius: 24, padding: "20px 24px",
        marginBottom: 20, border: "2px solid #f0e0a0",
        boxShadow: "0 4px 20px rgba(255,200,50,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#d97706", lineHeight: 1 }}
              key={pikachuScore} className={pikachuScore > 0 ? "pk-score-pop" : ""}>
              {pikachuScore}
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#92400e" }}>⚡ 피카츄</div>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#aaa" }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ea580c", lineHeight: 1 }}
              key={charmanderScore} className={charmanderScore > 0 ? "pk-score-pop" : ""}>
              {charmanderScore}
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9a3412" }}>🔥 파이리</div>
          </div>
        </div>

        {/* 게이지 바 */}
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 999, overflow: "hidden", display: "flex" }}>
          <div style={{
            width: `${pkPct}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
            transition: "width 0.5s cubic-bezier(0.34,1.2,0.64,1)",
          }} />
          <div style={{
            width: `${cmPct}%`, background: "linear-gradient(90deg, #f97316, #ef4444)",
            transition: "width 0.5s cubic-bezier(0.34,1.2,0.64,1)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.7rem", color: "#888" }}>
          <span>{pkPct}%</span>
          <span>총 {total}번 클릭</span>
          <span>{cmPct}%</span>
        </div>
      </div>

      {/* 클릭 버튼들 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* 피카츄 버튼 */}
        <button
          onClick={onPikachu}
          style={{
            background: "linear-gradient(135deg, #fff9c4, #fef3c7)",
            borderRadius: 24, padding: "24px 12px",
            border: "3px solid #fbbf24",
            boxShadow: "0 4px 20px rgba(251,191,36,0.3)",
            cursor: "pointer", transition: "transform 0.1s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SPRITE(25)} alt="피카츄" width={90} height={90} style={{ filter: "drop-shadow(0 4px 8px rgba(251,191,36,0.4))" }} />
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "#92400e" }}>⚡ 응원하기!</div>
          <div style={{
            background: "#fbbf24", borderRadius: 999, padding: "4px 16px",
            fontSize: "0.75rem", fontWeight: 700, color: "#78350f",
          }}>
            클릭! ⚡
          </div>
        </button>

        {/* 파이리 버튼 */}
        <button
          onClick={onCharmander}
          style={{
            background: "linear-gradient(135deg, #fff3e0, #ffe0cc)",
            borderRadius: 24, padding: "24px 12px",
            border: "3px solid #f97316",
            boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            cursor: "pointer", transition: "transform 0.1s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SPRITE(4)} alt="파이리" width={90} height={90} style={{ filter: "drop-shadow(0 4px 8px rgba(249,115,22,0.4))" }} />
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "#9a3412" }}>🔥 응원하기!</div>
          <div style={{
            background: "#f97316", borderRadius: 999, padding: "4px 16px",
            fontSize: "0.75rem", fontWeight: 700, color: "white",
          }}>
            클릭! 🔥
          </div>
        </button>
      </div>

      {/* 현재 우승자 */}
      {total > 0 && (
        <div style={{
          textAlign: "center", padding: "16px",
          background: winner === "tie" ? "#f9fafb"
            : winner === "pikachu" ? "#fff9c4" : "#fff3e0",
          borderRadius: 20,
          border: `2px solid ${winner === "tie" ? "#e5e7eb" : winner === "pikachu" ? "#fbbf24" : "#f97316"}`,
          animation: "pk-slide-up 0.3s ease",
        }}>
          {winner === "tie" ? (
            <span style={{ fontWeight: 800, color: "#6b7280" }}>⚖️ 현재 동점이에요!</span>
          ) : winner === "pikachu" ? (
            <span style={{ fontWeight: 800, color: "#d97706" }}>⚡ 피카츄가 앞서고 있어요!</span>
          ) : (
            <span style={{ fontWeight: 800, color: "#ea580c" }}>🔥 파이리가 앞서고 있어요!</span>
          )}
          {total >= 10 && total % 10 === 0 && (
            <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 4 }}>
              🎉 {total}번 달성! 계속 도전해봐요!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════════ */
export default function PokemonUI() {
  const [page, setPage] = useState<PageId>("home");
  const [transitioning, setTransitioning] = useState(false);
  const [flashEmoji, setFlashEmoji] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // 미니게임 점수
  const [pikachuScore, setPikachuScore] = useState(0);
  const [charmanderScore, setCharmanderScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);

  /* 페이지 이동 */
  const goto = useCallback((next: PageId) => {
    if (next === page || transitioning) return;
    const emoji = (next === "pikachu" || page === "pikachu") && next !== "charmander" ? "⚡" : "🔥";
    setFlashEmoji(emoji);
    setTransitioning(true);
    setVisible(false);
    setStatsLoaded(false);

    setTimeout(() => {
      setPage(next);
      setFlashEmoji(null);
      setTransitioning(false);
      setTimeout(() => {
        setVisible(true);
        if (next === "pikachu" || next === "charmander") {
          setTimeout(() => setStatsLoaded(true), 150);
        }
      }, 30);
    }, 420);
  }, [page, transitioning]);

  /* 파티클 생성 */
  const spawnParticles = useCallback((
    e: React.MouseEvent<HTMLButtonElement>,
    emoji: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const newPs: Particle[] = Array.from({ length: 7 }, () => ({
      id: ++particleId.current,
      x: cx + (Math.random() - 0.5) * 60,
      y: cy - 10,
      emoji,
      dx: (Math.random() - 0.5) * 60,
    }));
    setParticles(p => [...p, ...newPs]);
    setTimeout(() => {
      setParticles(p => p.filter(pt => !newPs.some(np => np.id === pt.id)));
    }, 950);
  }, []);

  /* 처음 통계 로드 */
  useEffect(() => {
    if (page === "pikachu" || page === "charmander") {
      setTimeout(() => setStatsLoaded(true), 250);
    }
  }, [page]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF8D6 0%, #FFE66D 30%, #FFD4A3 65%, #FF8E53 100%)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* 배경 장식 */}
      <BgDeco />

      {/* 전환 플래시 */}
      {flashEmoji && <TransitionFlash emoji={flashEmoji} />}

      {/* 파티클 */}
      {particles.map(p => <FloatingParticle key={p.id} p={p} />)}

      {/* 네비게이션 */}
      <Navbar current={page} onNav={goto} />

      {/* 컨텐츠 */}
      <main
        style={{
          paddingTop: 88,
          paddingBottom: 40,
          paddingLeft: 16,
          paddingRight: 16,
          maxWidth: 680,
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {page === "home"        && <HomePage onNav={goto} />}
        {page === "pikachu"     && <PikachuPage statsLoaded={statsLoaded} />}
        {page === "charmander"  && <CharmanderPage statsLoaded={statsLoaded} />}
        {page === "play"        && (
          <PlayPage
            pikachuScore={pikachuScore}
            charmanderScore={charmanderScore}
            onPikachu={(e) => {
              setPikachuScore(s => s + 1);
              spawnParticles(e, "⚡");
            }}
            onCharmander={(e) => {
              setCharmanderScore(s => s + 1);
              spawnParticles(e, "🔥");
            }}
          />
        )}
      </main>
    </div>
  );
}
