import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "참잘했어요 - AI 일기장",
  description: "AI가 24시간 후에 위로가 되는 댓글을 달아주는 일기장",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen`}>
        <header className="bg-[var(--primary-orange)] text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">참잘했어요</h1>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-[var(--accent-blue)] text-gray-800 p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>© 2024 참잘했어요. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
