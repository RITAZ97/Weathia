"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"; // 1. 引入 Session 类型

// 2. 显式定义 Props 的 TypeScript 类型
interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null; // 允许传入从服务端获取的 session，可以是 null
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    // 3. 把 session 传递给底层的 SessionProvider
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}