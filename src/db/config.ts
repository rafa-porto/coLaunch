/**
 * Configurações do banco de dados
 * Estas configurações são usadas para ajustar o comportamento do pool de conexões
 */

// Configurações do pool de conexões
export const dbPoolConfig = {
  // Número máximo de conexões no pool
  // Ajuste este valor com base nos recursos disponíveis e na carga esperada
  maxConnections: 10,
  
  // Tempo em segundos para fechar conexões ociosas
  // Conexões não utilizadas serão fechadas após este período
  idleTimeout: 20,
  
  // Tempo em segundos para timeout de conexão
  // Se uma conexão não puder ser estabelecida dentro deste período, ela falhará
  connectTimeout: 10,
  
  // Habilitar logs de debug
  // Útil para desenvolvimento, mas deve ser desativado em produção
  debug: process.env.NODE_ENV !== "production",
  
  // Usar SSL em produção
  // Importante para segurança em ambientes de produção
  ssl: process.env.NODE_ENV === "production",
};

// Função para obter a URL de conexão com o banco de dados
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    throw new Error("DATABASE_URL não está definida nas variáveis de ambiente");
  }
  
  return url;
}
