export type UserProfile = {
  id: string;
  name: string;
  email: string;
  team_id: string;
  role: "owner" | "member";
  avatar_url: string | null;
};
