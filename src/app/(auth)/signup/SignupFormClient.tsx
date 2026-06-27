"use client";

import { useState, useRef, useTransition } from "react";
import { signup } from "@/app/actions/auth";
import { Flash } from "@/components/ui/Flash";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function SignupFormClient({ serverError }: { serverError?: string }) {
  const [flashing, setFlashing] = useState(false);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flashing || !formRef.current) return;

    const formData = new FormData(formRef.current);

    setFlashing(true);

    setTimeout(() => {
      startTransition(() => {
        signup(formData);
      });
    }, 240);
  };

  return (
    <>
      {flashing && <Flash emoji="🔥" />}

      {serverError && (
        <div
          className="mb-5 flex items-center gap-2 text-sm px-4 py-3 rounded-2xl"
          style={{ background: "#fff0e0", color: "#c2410c", border: "1px solid #f97316" }}
        >
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-xs font-black mb-1.5 uppercase tracking-wide"
            style={{ color: "#c2410c" }}
          >
            이메일
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            placeholder="trainer@pokemon.com"
            className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
            style={{ border: "2px solid #fdba74", background: "#fff7ed", color: "#3e2723" }}
          />
        </div>
        <div>
          <label
            className="block text-xs font-black mb-1.5 uppercase tracking-wide"
            style={{ color: "#c2410c" }}
          >
            비밀번호
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
            style={{ border: "2px solid #fdba74", background: "#fff7ed", color: "#3e2723" }}
          />
          <p className="mt-1.5 text-xs pl-1" style={{ color: "#ea580c" }}>
            8자 이상 입력해주세요
          </p>
        </div>
        <button
          type="submit"
          disabled={flashing}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #FF9800 0%, #F44336 55%, #C62828 100%)",
            boxShadow: "0 4px 18px rgba(244,67,54,0.38)",
          }}
        >
          {flashing ? "🔥 불꽃 피어나는 중…" : "🔥 모험 시작하기 ⚡"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm" style={{ color: "#92400e" }}>
        이미 트레이너인가요?{" "}
        <TransitionLink
          href="/login"
          emoji="⚡"
          className="font-black hover:underline"
          style={{ color: "#c2410c" }}
        >
          로그인
        </TransitionLink>
      </p>
    </>
  );
}
