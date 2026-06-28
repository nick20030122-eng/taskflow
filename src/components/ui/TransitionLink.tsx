"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { Flash } from "./Flash";

function NavLoader() {
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998,
        height: 3, overflow: "hidden",
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "linear-gradient(90deg, #FFD700, #FF6D00, #FF3D00)",
          animation: "nav-progress 1.4s ease-in-out infinite",
          boxShadow: "0 0 8px rgba(255,160,0,0.8)",
        }}
      />
      <style>{`
        @keyframes nav-progress {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(20%); }
          100% { transform: translateX(110%); }
        }
      `}</style>
    </div>
  );
}

export function TransitionLink({
  href,
  children,
  emoji = "⚡",
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  emoji?: "⚡" | "🔥";
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const [flashing, setFlashing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (flashing) return;
      setFlashing(true);
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, 390);
    },
    [href, router, flashing]
  );

  return (
    <>
      {flashing && <Flash emoji={emoji} />}
      {isPending && <NavLoader />}
      <a href={href} onClick={handleClick} className={className} style={style}>
        {children}
      </a>
    </>
  );
}
