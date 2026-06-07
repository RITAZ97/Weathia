import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. 🌟 导入你的全局状态包围圈和顶栏组件（请根据你真实的文件夹路径调整这里的 @/components ）
import AuthProvider from "./components/AuthProvider"; 
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weathia", // 顺手把标题改得更酷炫一点
  description: "Next-gen intelligent weather forecasting application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {/* 2. 🌟 最外层用 AuthProvider 包裹，广播 NextAuth 登录状态 */}
        <AuthProvider>
          
          {/* 3. 🌟 把全站统一的 Header 放在这里，它会自动置顶显示 */}
          <Header />
          
          {/* 4. 🌟 用一个 main 标签把页面内容包起来，pt-16 是为了防止内容被固定的 Header 挡住 */}
          <main className=" min-h-screen">
            {children}
          </main>

        </AuthProvider>
      </body>
    </html>
  );
}