"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Flash } from "./Flash";

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (flashing) return;
      setFlashing(true);
      setTimeout(() => router.push(href), 390);
    },
    [href, router, flashing]
  );

  return (
    <>
      {flashing && <Flash emoji={emoji} />}
      <a href={href} onClick={handleClick} className={className} style={style}>
        {children}
      </a>
    </>
  );
}
