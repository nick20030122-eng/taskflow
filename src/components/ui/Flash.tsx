"use client";

/* 재사용 가능한 전환 이펙트 컴포넌트 */
export function Flash({ emoji }: { emoji: "⚡" | "🔥" }) {
  const isThunder = emoji === "⚡";

  const ring1 = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * 360, radius: 130,
    size: 1.6 + (i % 3) * 0.55, delay: 0.02 + (i % 4) * 0.016,
  }));
  const ring2 = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * 360 + 13, radius: 245,
    size: 1.2 + (i % 4) * 0.45, delay: 0.06 + (i % 5) * 0.013,
  }));
  const ring3 = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * 360 + 9, radius: 375,
    size: 0.9 + (i % 3) * 0.35, delay: 0.11 + (i % 6) * 0.01,
  }));
  const scatter = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i % 10) * 10.5 + Math.sin(i * 1.4) * 4 + 1}%`,
    top: `${Math.floor(i / 10) * 24 + Math.cos(i * 0.85) * 7 + 2}%`,
    size: 0.8 + (i % 6) * 0.35,
    delay: (i % 12) * 0.016,
    dur: 0.28 + (i % 7) * 0.036,
  }));

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        animation: "pk-flash 0.58s ease forwards",
        background: isThunder
          ? "radial-gradient(circle at 50% 50%, rgba(255,230,109,0.93) 0%, rgba(255,210,80,0.50) 35%, rgba(255,245,160,0.14) 65%, transparent 82%)"
          : "radial-gradient(circle at 50% 50%, rgba(255,100,50,0.90) 0%, rgba(255,140,70,0.50) 35%, rgba(255,195,110,0.14) 65%, transparent 82%)",
      }}
    >
      <span
        style={{
          position: "absolute", fontSize: "9rem", lineHeight: 1,
          animation: "pk-mega-flash 0.58s cubic-bezier(0.34,1.4,0.64,1) forwards",
          zIndex: 2,
          filter: `drop-shadow(0 0 52px ${isThunder ? "#FFE066" : "#FF6B35"})
                   drop-shadow(0 0 90px ${isThunder ? "#FFD700" : "#FF3D00"})`,
        }}
      >
        {emoji}
      </span>

      {ring1.map((r, i) => (
        <span key={`r1-${i}`} style={{
          position: "absolute", fontSize: `${r.size}rem`, opacity: 0,
          animation: "pk-ring-item 0.58s ease forwards",
          animationDelay: `${r.delay}s`,
          transform: `rotate(${r.angle}deg) translateY(-${r.radius}px)`,
        }}>{emoji}</span>
      ))}
      {ring2.map((r, i) => (
        <span key={`r2-${i}`} style={{
          position: "absolute", fontSize: `${r.size}rem`, opacity: 0,
          animation: "pk-ring-item 0.58s ease forwards",
          animationDelay: `${r.delay}s`,
          transform: `rotate(${r.angle}deg) translateY(-${r.radius}px)`,
        }}>{emoji}</span>
      ))}
      {ring3.map((r, i) => (
        <span key={`r3-${i}`} style={{
          position: "absolute", fontSize: `${r.size}rem`, opacity: 0,
          animation: "pk-ring-item 0.58s ease forwards",
          animationDelay: `${r.delay}s`,
          transform: `rotate(${r.angle}deg) translateY(-${r.radius}px)`,
        }}>{emoji}</span>
      ))}
      {scatter.map((s, i) => (
        <span key={`s-${i}`} style={{
          position: "absolute", left: s.left, top: s.top,
          fontSize: `${s.size}rem`, opacity: 0,
          animation: `pk-scatter-pop ${s.dur}s ease forwards`,
          animationDelay: `${s.delay}s`,
        }}>{emoji}</span>
      ))}
    </div>
  );
}
