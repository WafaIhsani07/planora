import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

        const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            appType: "WEB",
          }),
        });

        if (!response.ok) {
          return null;
        }

        const payload = (await response.json()) as LoginResponse;
        const user = payload.data?.user;
        const role = user?.role;

        if (!user?.id || !user.email || !role) {
          return null;
        }

        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          role,
          accessToken: payload.data?.accessToken,
          refreshToken: payload.data?.refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.userId = (user as { id?: string }).id;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string | undefined;
        (session.user as { role?: string; id?: string }).id = token.userId as string | undefined;
      }

      (session as { accessToken?: string; refreshToken?: string }).accessToken =
        token.accessToken as string | undefined;
      (session as { accessToken?: string; refreshToken?: string }).refreshToken =
        token.refreshToken as string | undefined;

      return session;
    },
  },
};
