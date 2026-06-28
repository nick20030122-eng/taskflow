"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Flash } from "@/components/ui/Flash";

const NAV_ITEMS = [
  { href: "/tasks", icon: "🔥", label: "태스크 목록", emoji: "🔥" as const, soon: false },
  { href: "/today", icon: "⚡", label: "오늘 할 일",  emoji: "⚡" as const, soon: false },
  { href: "/team",  icon: "👥", label: "팀 관리",     emoji: "⚡" as const, soon: true  },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [skillFlash, setSkillFlash] = useState<"⚡" | "🔥" | null>(null);

  const fireSkill = (emoji: "⚡" | "🔥") => {
    if (skillFlash) return;
    setSkillFlash(emoji);
    setTimeout(() => setSkillFlash(null), 700);
  };

  return (
    <>
      {skillFlash && <Flash emoji={skillFlash} />}

      <aside
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
          zIndex: 30, display: "flex", flexDirection: "column",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderRight: "2px solid rgba(251,191,36,0.35)",
          boxShadow: "3px 0 28px rgba(255,180,50,0.14)",
          overflowY: "auto",
        }}
      >
        {/* ── 로고 ── */}
        <TransitionLink
          href="/tasks"
          emoji="⚡"
          style={{
            textDecoration: "none", padding: "22px 18px 16px",
            borderBottom: "1px solid rgba(251,191,36,0.22)", display: "block",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span className="pk-float" style={{ fontSize: "1.3rem", display: "inline-block", animationDuration: "2.4s" }}>⚡</span>
            <span style={{ fontWeight: 900, fontSize: "1.18rem", color: "#e65100", letterSpacing: "-0.3px" }}>TaskFlow</span>
            <span className="flame" style={{ fontSize: "1.3rem", display: "inline-block" }}>🔥</span>
          </div>
          <div style={{ fontSize: "0.62rem", color: "#b45309", paddingLeft: 30, fontWeight: 600 }}>
            #025 피카츄 · #004 파이리
          </div>
        </TransitionLink>

        {/* ── 네비게이션 ── */}
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#d97706", padding: "2px 10px 10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            메뉴
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = !item.soon && pathname.startsWith(item.href);

            if (item.soon) {
              return (
                <div key={item.href}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: 14, marginBottom: 3,
                    opacity: 0.38, cursor: "not-allowed", color: "#6b7280",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "0.52rem", fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb" }}>
                    soon
                  </span>
                </div>
              );
            }

            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                emoji={item.emoji}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 14, marginBottom: 3,
                  textDecoration: "none", transition: "background 0.15s, border-color 0.15s",
                  background: isActive ? "#fff9c4" : "transparent",
                  border: `1.5px solid ${isActive ? "#fbbf24" : "transparent"}`,
                  color: isActive ? "#c2410c" : "#4b5563",
                  fontWeight: isActive ? 800 : 500,
                  boxShadow: isActive ? "0 2px 8px rgba(251,191,36,0.2)" : "none",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.82rem" }}>{item.label}</span>
                {isActive && (
                  <span className="pk-float" style={{ marginLeft: "auto", fontSize: "0.7rem", animationDuration: "1.8s" }}>✨</span>
                )}
              </TransitionLink>
            );
          })}
        </nav>

        {/* ── ⚡🔥 스킬 창 ── */}
        <div
          style={{
            padding: "14px 12px",
            borderTop: "1px solid rgba(251,191,36,0.22)",
            borderBottom: "1px solid rgba(251,191,36,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "0.58rem", fontWeight: 800, color: "#d97706",
              padding: "0 4px 8px", letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            스킬
          </div>

          {/* 100만 볼트 */}
          <button
            onClick={() => fireSkill("⚡")}
            disabled={!!skillFlash}
            style={{
              width: "100%", marginBottom: 8,
              padding: "10px 14px",
              borderRadius: 14,
              border: "2px solid #FFD700",
              background: skillFlash === "⚡"
                ? "linear-gradient(135deg, #FFE566, #FFB300)"
                : "linear-gradient(135deg, #fffde7, #fff8e1)",
              color: "#B8860B",
              fontSize: "0.82rem", fontWeight: 800,
              cursor: skillFlash ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 3px 10px rgba(255,193,7,0.28)",
            }}
            onMouseEnter={(e) => {
              if (!skillFlash) {
                e.currentTarget.style.background = "linear-gradient(135deg, #FFE566, #FFCA28)";
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,193,7,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #fffde7, #fff8e1)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 3px 10px rgba(255,193,7,0.28)";
            }}
          >
            <span
              className="pk-float"
              style={{ fontSize: "1.1rem", display: "inline-block", animationDuration: "1.6s" }}
            >
              ⚡
            </span>
            <span>100만 볼트</span>
          </button>

          {/* 불꽃세례 */}
          <button
            onClick={() => fireSkill("🔥")}
            disabled={!!skillFlash}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 14,
              border: "2px solid #FF7043",
              background: skillFlash === "🔥"
                ? "linear-gradient(135deg, #FFAB91, #FF7043)"
                : "linear-gradient(135deg, #fff3e0, #ffe0b2)",
              color: "#BF360C",
              fontSize: "0.82rem", fontWeight: 800,
              cursor: skillFlash ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 3px 10px rgba(255,112,67,0.25)",
            }}
            onMouseEnter={(e) => {
              if (!skillFlash) {
                e.currentTarget.style.background = "linear-gradient(135deg, #FFAB91, #FF7043)";
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,112,67,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #fff3e0, #ffe0b2)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 3px 10px rgba(255,112,67,0.25)";
            }}
          >
            <span className="flame" style={{ fontSize: "1.1rem", display: "inline-block" }}>🔥</span>
            <span>불꽃세례</span>
          </button>
        </div>

        {/* ── 사용자 · 로그아웃 ── */}
        <div style={{ padding: "12px 16px 16px" }}>
          <div
            style={{
              fontSize: "0.7rem", color: "#6b7280", marginBottom: 8,
              wordBreak: "break-all", lineHeight: 1.4,
              padding: "6px 10px", borderRadius: 10,
              background: "#fafafa", border: "1px solid #f0e0a0",
            }}
          >
            {email}
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: "100%", padding: "7px 12px",
                borderRadius: 12, border: "1.5px solid #fde68a",
                background: "linear-gradient(135deg, #fffbeb, #fff3e0)",
                color: "#d97706", fontSize: "0.75rem", fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffe566";
                e.currentTarget.style.color = "#92400e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #fffbeb, #fff3e0)";
                e.currentTarget.style.color = "#d97706";
              }}
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
