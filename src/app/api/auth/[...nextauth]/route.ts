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
          
          return { id: user.id, email: user.email };
        } catch (dbError: any) {
          console.error("Database connection collapsed:", dbError.message || dbError);
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/register",
  }
});

export { handler as GET, handler as POST };