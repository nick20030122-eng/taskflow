import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // robots.txt는 크롤러에게 주는 지침일 뿐 보안 장치가 아니다.
  // /dashboard·/api 는 Supabase Auth·RLS로 실제 보호한다.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://taskflow.vercel.app/sitemap.xml",
  };
}
