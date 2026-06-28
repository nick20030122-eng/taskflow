"use client";

import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { TransitionLink } from "@/components/ui/TransitionLink";

type AuthState = { error?: string };

export function SignupFormClient({ serverError }: { serverError?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
    { error: serverError }
  );

  return (
    <>
      {state?.error && (
        <div
          className="mb-5 flex items-center gap-2 text-sm px-4 py-3 rounded-2xl"
          style={{ background: "#fff0e0", color: "#c2410c", border: "1px solid #f97316" }}
        >
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={action} className="space-y-4">
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
          disabled={pending}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #FF9800 0%, #F44336 55%, #C62828 100%)",
            boxShadow: "0 4px 18px rgba(244,67,54,0.38)",
          }}
        >
          {pending ? "🔥 가입 중…" : "🔥 모험 시작하기 ⚡"}
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
