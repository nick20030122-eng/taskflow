/* Server Component — CSS 애니메이션만 사용, JS 불필요 */

interface Item {
  e: string;
  t: string;
  l?: string;
  r?: string;
  fs: string;
  op: number;
  cls: "pk-float" | "pk-drift" | "flame";
  ad: string;
  adur: string;
}

const ITEMS: Item[] = [
  /* ── 거대 대기층 (opacity 낮음, 깊이감) ── */
  { e:"⚡", t:"9%",   l:"7%",   fs:"6.5rem", op:0.10, cls:"pk-float", ad:"0s",    adur:"4.8s" },
  { e:"🔥", t:"14%",  r:"8%",   fs:"6rem",   op:0.09, cls:"flame",    ad:"0.6s",  adur:"4.2s" },
  { e:"⚡", t:"75%",  l:"5%",   fs:"5.5rem", op:0.09, cls:"pk-float", ad:"1.3s",  adur:"5.2s" },
  { e:"🔥", t:"70%",  r:"6%",   fs:"5.5rem", op:0.08, cls:"flame",    ad:"0.4s",  adur:"4s"   },

  /* ── 큰 플로팅 이모지 (주요 장식) ── */
  { e:"⚡", t:"4%",   l:"32%",  fs:"3.8rem", op:0.22, cls:"pk-float", ad:"0.4s",  adur:"2.9s" },
  { e:"🔥", t:"5%",   r:"30%",  fs:"3.4rem", op:0.20, cls:"flame",    ad:"0.9s",  adur:"3.3s" },
  { e:"✨", t:"20%",  l:"3%",   fs:"3.2rem", op:0.20, cls:"pk-drift", ad:"1s",    adur:"5.2s" },
  { e:"💫", t:"26%",  r:"2%",   fs:"3rem",   op:0.18, cls:"pk-drift", ad:"0.5s",  adur:"4.8s" },
  { e:"⚡", t:"46%",  l:"1%",   fs:"3.2rem", op:0.21, cls:"pk-float", ad:"1.5s",  adur:"3.2s" },
  { e:"🔥", t:"50%",  r:"1%",   fs:"3rem",   op:0.20, cls:"flame",    ad:"0.7s",  adur:"3.6s" },
  { e:"🌟", t:"63%",  l:"38%",  fs:"2.8rem", op:0.17, cls:"pk-drift", ad:"2s",    adur:"5.8s" },
  { e:"💛", t:"67%",  r:"33%",  fs:"2.8rem", op:0.17, cls:"pk-drift", ad:"1.3s",  adur:"4.6s" },
  { e:"⚡", t:"85%",  l:"20%",  fs:"3.2rem", op:0.20, cls:"pk-float", ad:"0.8s",  adur:"2.7s" },
  { e:"🔥", t:"82%",  r:"22%",  fs:"3rem",   op:0.19, cls:"flame",    ad:"1.7s",  adur:"3.4s" },
  { e:"✨", t:"38%",  l:"45%",  fs:"2.5rem", op:0.16, cls:"pk-drift", ad:"2.5s",  adur:"5.5s" },
  { e:"💫", t:"16%",  l:"52%",  fs:"2.4rem", op:0.15, cls:"pk-float", ad:"3s",    adur:"4.1s" },

  /* ── 중간 반짝임층 ── */
  { e:"⭐", t:"33%",  l:"23%",  fs:"1.9rem", op:0.18, cls:"pk-float", ad:"0.6s",  adur:"3.5s" },
  { e:"💫", t:"36%",  r:"27%",  fs:"1.7rem", op:0.16, cls:"pk-drift", ad:"1.1s",  adur:"4.2s" },
  { e:"✨", t:"57%",  l:"16%",  fs:"1.8rem", op:0.17, cls:"pk-drift", ad:"2.2s",  adur:"5s"   },
  { e:"⭐", t:"54%",  r:"18%",  fs:"1.9rem", op:0.16, cls:"pk-float", ad:"0.3s",  adur:"3.8s" },
  { e:"💛", t:"42%",  l:"10%",  fs:"1.6rem", op:0.14, cls:"pk-drift", ad:"3s",    adur:"6s"   },
  { e:"🌟", t:"78%",  l:"50%",  fs:"1.7rem", op:0.15, cls:"pk-float", ad:"2.5s",  adur:"4s"   },
  { e:"✨", t:"90%",  l:"52%",  fs:"1.5rem", op:0.13, cls:"pk-drift", ad:"1.8s",  adur:"5.4s" },
  { e:"💫", t:"93%",  l:"30%",  fs:"1.6rem", op:0.12, cls:"pk-float", ad:"2.8s",  adur:"4.3s" },

  /* ── 소형 포인트 (촘촘한 터치) ── */
  { e:"⚡", t:"11%",  l:"17%",  fs:"1.3rem", op:0.16, cls:"pk-float", ad:"3.2s",  adur:"3.1s" },
  { e:"🔥", t:"29%",  l:"60%",  fs:"1.2rem", op:0.14, cls:"flame",    ad:"1.4s",  adur:"2.8s" },
  { e:"⚡", t:"59%",  l:"53%",  fs:"1.3rem", op:0.14, cls:"pk-float", ad:"0.9s",  adur:"3.6s" },
  { e:"🔥", t:"44%",  l:"28%",  fs:"1.1rem", op:0.12, cls:"flame",    ad:"2s",    adur:"3s"   },
  { e:"✨", t:"96%",  r:"14%",  fs:"1.3rem", op:0.13, cls:"pk-drift", ad:"1.6s",  adur:"4.8s" },
  { e:"⭐", t:"87%",  r:"48%",  fs:"1.1rem", op:0.12, cls:"pk-float", ad:"3.5s",  adur:"3.9s" },
  { e:"💛", t:"22%",  r:"48%",  fs:"1.2rem", op:0.12, cls:"pk-drift", ad:"4s",    adur:"5.1s" },
  { e:"🌟", t:"72%",  l:"8%",   fs:"1rem",   op:0.10, cls:"pk-drift", ad:"2.7s",  adur:"4.7s" },
];

export function BgDeco() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        userSelect: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className={item.cls}
          style={{
            position: "absolute",
            top: item.t,
            left: item.l,
            right: item.r,
            fontSize: item.fs,
            opacity: item.op,
            animationDelay: item.ad,
            animationDuration: item.adur,
            lineHeight: 1,
          }}
        >
          {item.e}
        </span>
      ))}
    </div>
  );
}
