import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const authSecret = process.env.AUTH_SECRET;
const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret:
    authSecret ??
    (process.env.NODE_ENV === "production"
      ? "placeholder-auth-secret-set-env-AUTH_SECRET"
      : "development-auth-secret-not-for-production"),
  trustHost: true,
  pages: {
    signIn: "/login",
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
        name: { label: "Name", type: "text" },
      },
      authorize: async (credentials) => {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
        const password = typeof passwordRaw === "string" ? passwordRaw : "";
        const nameRaw = credentials?.name;
        const name =
          typeof nameRaw === "string" && nameRaw.trim().length > 0
            ? nameRaw.trim()
            : (email.split("@")[0] ?? "Member");

        if (!email || password.length < 6) {
          return null;
        }

        return {
          email,
          id: email,
          name,
        };
      },
    }),
  ],
});
