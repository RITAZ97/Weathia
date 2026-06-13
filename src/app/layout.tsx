import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider"; 
import { getServerSession } from "next-auth"; // 1. 引入获取服务端 Session 的方法

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weathia", 
  description: "Next-gen intelligent weather forecasting application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. 在服务端预先获取一次 session 状态
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {/* 3. 将获取到的 session 传递给 AuthProvider 锁死初始状态 */}
        <AuthProvider session={session}>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}