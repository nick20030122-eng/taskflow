import { login } from "@/app/actions/auth";

export const metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, #ffe0b2 0%, #fff8f0 50%, #fff3e0 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #ffe0b2, #ffcc80)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
                alt="파이리"
                width={72}
                height={72}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xl flame">🔥</span>
          </div>
          <h1 className="text-2xl font-black mt-3" style={{ color: "#e65100" }}>
            돌아왔군요, 트레이너!
          </h1>
          <p className="text-sm mt-1" style={{ color: "#a1887f" }}>
            TaskFlow에 로그인하세요
          </p>
        </div>

        <div
          className="bg-white rounded-3xl p-8 border"
          style={{
            borderColor: "#ffcc80",
            boxShadow: "0 8px 32px rgba(255,109,0,0.12)",
          }}
        >
          {error && (
            <div
              className="mb-5 flex items-center gap-2 text-sm px-4 py-3 rounded-2xl"
              style={{
                background: "#fff3e0",
                color: "#e65100",
                border: "1px solid #ffcc80",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form action={login} className="space-y-4">
            <div>
              <label
                className="block text-xs font-black mb-1.5 uppercase tracking-wide"
                style={{ color: "#ff6d00" }}
              >
                이메일
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="trainer@pokemon.com"
                className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all placeholder-orange-200"
                style={{
                  border: "2px solid #ffe0b2",
                  background: "#fff8f0",
                  color: "#3e2723",
                }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-black mb-1.5 uppercase tracking-wide"
                style={{ color: "#ff6d00" }}
              >
                비밀번호
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all placeholder-orange-200"
                style={{
                  border: "2px solid #ffe0b2",
                  background: "#fff8f0",
                  color: "#3e2723",
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-sm font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-1"
              style={{
                background: "linear-gradient(135deg, #ff6d00, #ff3d00)",
                boxShadow: "0 4px 16px rgba(255,109,0,0.35)",
              }}
            >
              🔥 로그인
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "#a1887f" }}>
          아직 트레이너가 아닌가요?{" "}
          <a
            href="/signup"
            className="font-black hover:underline"
            style={{ color: "#ff6d00" }}
          >
            등록하기
          </a>
        </p>
      </div>
    </main>
  );
}
