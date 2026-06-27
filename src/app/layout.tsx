import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taskflow.vercel.app"),
  title: {
    template: "%s | TaskFlow",
    default: "TaskFlow — 팀의 오늘 할 일을 한 화면에서",
  },
  description:
    "5~20인 스타트업 팀의 PM이 태스크 우선순위를 한 화면에서 파악하고 하루를 시작하는 협업 도구",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://taskflow.vercel.app",
    siteName: "TaskFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskFlow — 팀 태스크 우선순위 관리 서비스",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
