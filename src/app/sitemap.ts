import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://taskflow.vercel.app";
  return [
    // 현재 존재하는 공개 페이지만 포함
    // /dashboard·/tasks·/teams·/today 는 로그인 필요 — 제외
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
