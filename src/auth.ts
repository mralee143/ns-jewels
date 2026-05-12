import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getAuthSecret } from "@/lib/auth-secret";
import { verifyPassword } from "@/lib/password";
import { adapterWithoutUserImage } from "@/lib/prisma-auth-adapter";
import { prisma } from "@/lib/prisma";

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: adapterWithoutUserImage(PrismaAdapter(prisma)),
  secret: getAuthSecret(),
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "USER";
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "USER";
      }
      return session;
    },
  },
  providers: [
    ...(googleId && googleSecret
      ? [
          Google({
            clientId: googleId,
            clientSecret: googleSecret,
          }),
        ]
      : []),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        const email =
          typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
        const password = typeof passwordRaw === "string" ? passwordRaw : "";

        if (!email || password.length < 6) {
          return null;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser?.passwordHash) {
          return null;
        }

        const valid = await verifyPassword(password, dbUser.passwordHash);
        if (!valid) {
          return null;
        }

        if (!dbUser.emailVerified) {
          return null;
        }

        return {
          id: dbUser.id,
          email: dbUser.email ?? email,
          name: dbUser.name ?? undefined,
          role: dbUser.role,
        };
      },
    }),
  ],
});
