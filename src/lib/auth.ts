import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { sendMagicLinkEmail } from "./email";
import { withDbConnection } from "./db-utils";

// Função para verificar se as credenciais sociais estão configuradas
function getSocialProviders() {
  const providers: Record<string, { clientId: string; clientSecret: string }> =
    {};

  // Adicionar Google se as credenciais estiverem configuradas
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  // Adicionar GitHub se as credenciais estiverem configuradas
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }

  return providers;
}

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: getSocialProviders(),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    // Configurações adicionais são gerenciadas pelo pool de conexões
  }),
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Usar o gerenciamento de conexões para enviar o email
        return withDbConnection(async () => {
          try {
            await sendMagicLinkEmail({ email, url });
          } catch (error) {
            console.error("Failed to send magic link email:", error);
            throw new Error("Failed to send magic link email");
          }
        });
      },
    }),
  ],

  // Configurações adicionais para melhorar a performance
  sessionTTL: 24 * 60 * 60, // 24 horas em segundos
  rateLimiter: {
    enabled: true,
    maxRequests: 100, // Máximo de requisições por IP
    windowMs: 15 * 60 * 1000, // 15 minutos
  },
});
