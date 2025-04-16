import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "참잘했어요 - AI 일기장",
  description: "AI가 24시간 후에 위로가 되는 댓글을 달아주는 일기장",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen`}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b">
            <div className="max-w-2xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="text-xl font-bold text-[var(--primary-orange)]">
                  GoodJob Diary
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href="/write"
                    className="text-gray-600 hover:text-[var(--primary-orange)] transition-colors"
                  >
                    ✏️ 일기 쓰기
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </div>
        <footer className="bg-[var(--accent-blue)] text-gray-800 p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>© 2025 참잘했어요. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
