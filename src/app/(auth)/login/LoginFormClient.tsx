"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { TransitionLink } from "@/components/ui/TransitionLink";

type AuthState = { error?: string };

export function LoginFormClient({ serverError }: { serverError?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    { error: serverError }
  );

  return (
    <>
      {state?.error && (
        <div
          className="mb-5 flex items-center gap-2 text-sm px-4 py-3 rounded-2xl"
          style={{ background: "#fff9c4", color: "#c2410c", border: "1px solid #fbbf24" }}
        >
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label
            className="block text-xs font-black mb-1.5 uppercase tracking-wide"
            style={{ color: "#d97706" }}
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
            style={{ border: "2px solid #fde68a", background: "#fffbeb", color: "#3e2723" }}
          />
        </div>
        <div>
          <label
            className="block text-xs font-black mb-1.5 uppercase tracking-wide"
            style={{ color: "#d97706" }}
          >
            비밀번호
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
            style={{ border: "2px solid #fde68a", background: "#fffbeb", color: "#3e2723" }}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA000 55%, #FF6F00 100%)",
            boxShadow: "0 4px 18px rgba(255,160,0,0.42)",
          }}
        >
          {pending ? "⚡ 로그인 중…" : "⚡ 번개처럼 로그인 🔥"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm" style={{ color: "#92400e" }}>
        아직 트레이너가 아닌가요?{" "}
        <TransitionLink
          href="/signup"
          emoji="🔥"
          className="font-black hover:underline"
          style={{ color: "#c2410c" }}
        >
          등록하기
        </TransitionLink>
      </p>
    </>
  );
}
