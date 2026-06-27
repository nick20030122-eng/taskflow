import { signup } from "@/app/actions/auth";

export const metadata = { title: "회원가입" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">TaskFlow 회원가입</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <form action={signup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <p className="mt-1 text-xs text-gray-400">8자 이상</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            가입하기
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-gray-900 font-medium hover:underline">
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}
