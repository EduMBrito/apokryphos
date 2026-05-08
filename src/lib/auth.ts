import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Conecta o NextAuth ao nosso banco PostgreSQL usando o Prisma
  adapter: PrismaAdapter(prisma) as any,
  
  // Provedores de Login
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  // A chave de criptografia dos cookies
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  
  // Callbacks são funções que rodam em momentos específicos do ciclo de autenticação
 callbacks: {
    async signIn({ user }) {
      // Holofote ligado: Imprime no terminal do WSL o que veio do Google
      console.log("=== TENTATIVA DE LOGIN ===");
      console.log("Email recebido do Google: ->", user.email, "<-");
      
      // Converte para minúsculas e remove espaços vazios por segurança
      const incomingEmail = user.email?.toLowerCase().trim();

      if (incomingEmail === "eduardomsbrito@gmail.com") {
        console.log("Mestre reconhecido. Abrindo os portões.");
        return true; 
      }
      
      console.log("Acesso negado. E-mail não autorizado.");
      return false; 
    },
  },
};