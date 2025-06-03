// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protege todas as rotas, exceto arquivos estáticos do Next.js
    "/((?!_next|.*\\..*).*)",

    // Garante proteção de APIs (se usar API routes)
    "/(api|trpc)(.*)",

    // Garante que rotas como /login sejam cobertas
    "/login",
  ],
};
