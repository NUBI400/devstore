import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "./db";

// Configuração do adaptador apenas em produção
const adapter = process.env.NODE_ENV === "production" 
  ? { adapter: PrismaAdapter(db) as any }
  : {};

export const authOptions: NextAuthOptions = {
  ...adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    // Provider de credenciais para desenvolvimento
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        name: { label: "Nome", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) return null;

        // Cria um usuário de desenvolvimento
        const user = {
          id: "dev-user-id",
          name: credentials.name,
          email: credentials.email,
          image: "https://placehold.co/400x400/1f2937/ffffff?text=Dev",
          role: "USER",
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id || "dev-user-id";
        session.user.name = token.name || "Usuário Dev";
        session.user.email = token.email || "dev@example.com";
        session.user.image = token.picture || "https://placehold.co/400x400/1f2937/ffffff?text=Dev";
        session.user.role = token.role as any || "USER";
      }

      return session;
    },
    async jwt({ token, user }) {
      // Se estamos em modo de desenvolvimento e não há usuário no banco
      if (process.env.NODE_ENV !== "production" && !user) {
        return {
          id: "dev-user-id",
          name: "Usuário Dev",
          email: "dev@example.com",
          picture: "https://placehold.co/400x400/1f2937/ffffff?text=Dev",
          role: "USER",
        };
      }

      // Em desenvolvimento, podemos pular a consulta ao banco
      if (process.env.NODE_ENV !== "production") {
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.image,
            role: "USER",
          };
        }
        return token;
      }

      const dbUser = user ? user : await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-do-not-use-in-production",
}; 