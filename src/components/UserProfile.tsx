// CLAUDE.md 있음 — Server Component, strict 타입, console.log 없음
import type { UserProfile } from "@/types/user";

type Props = {
  profile: UserProfile;
};

export default function UserProfileCard({ profile }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        역할: {profile.role === "owner" ? "팀장" : "팀원"}
      </div>
    </div>
  );
}
