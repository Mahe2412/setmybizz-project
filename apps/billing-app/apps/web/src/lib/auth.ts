import { prisma } from "@billease/db";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          console.error("[auth] No user for email:", email);
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        const membership = await prisma.membership.findFirst({
          where: { userId: user.id },
          include: { business: true },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          businessId: membership?.businessId ?? null,
          businessName: membership?.business.name ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.businessId = (user as { businessId?: string }).businessId;
        token.businessName = (user as { businessName?: string }).businessName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.businessId = token.businessId as string | null;
        session.user.businessName = token.businessName as string | null;
      }
      return session;
    },
  },
};
