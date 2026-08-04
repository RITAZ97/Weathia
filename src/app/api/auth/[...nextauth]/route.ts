export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          console.log("Attempting database connection to fetch user...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          });
          console.log("Database query finished. User found:", user ? "Yes" : "No");
          
          if (!user || !user.password) {
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }
          return { 
            id: user.id, 
            email: user.email,
            isPremium: (user as any).isPremium || false 
          };
        } catch (dbError: any) {
          console.error("Database connection collapsed:", dbError.message || dbError);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.isPremium = (user as any).isPremium || false;
      } 
      else if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { isPremium: true } 
          });
          token.isPremium = dbUser?.isPremium || false;
        } catch (error) {
          console.error("Failed to refresh user premium status in JWT:", error);
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).isPremium = token.isPremium;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/register",
  }
});

export { handler as GET, handler as POST };