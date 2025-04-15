import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { dbPoolConfig, getDatabaseUrl } from "./config";

config({ path: ".env" }); // or .env.local

// Obter a URL de conexão com o banco de dados
const connectionString = getDatabaseUrl();

// Configuração do pool de conexões usando as configurações definidas
const client = postgres(connectionString, {
  max: dbPoolConfig.maxConnections,
  idle_timeout: dbPoolConfig.idleTimeout,
  connect_timeout: dbPoolConfig.connectTimeout,
  debug: dbPoolConfig.debug,
  ssl: dbPoolConfig.ssl,
});

// Configuração do Drizzle com suporte a consultas
export const db = drizzle(client, { schema });

// Função para fechar o pool de conexões (usar em testes ou quando a aplicação for encerrada)
export const closeConnection = async () => {
  await client.end();
  console.log("Database connection pool closed");
};
