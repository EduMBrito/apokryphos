// Importa o segurança padrão do NextAuth
export { default } from "next-auth/middleware";

// Define quais portas ele deve vigiar
export const config = {
  matcher: [
    "/write",
    "/edit/:path*",
    // Futuramente, podemos adicionar rotas de configurações aqui
  ],
};