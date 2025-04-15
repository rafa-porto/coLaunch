import { db, closeConnection } from "@/db/drizzle";

/**
 * Executa uma função com gerenciamento de conexão com o banco de dados
 * 
 * @param fn Função a ser executada com acesso ao banco de dados
 * @returns Resultado da função
 */
export async function withDbConnection<T>(
  fn: () => Promise<T>
): Promise<T> {
  try {
    // Executar a função
    return await fn();
  } catch (error) {
    // Registrar o erro
    console.error("Erro ao executar função com conexão de banco de dados:", error);
    
    // Propagar o erro
    throw error;
  }
}

/**
 * Executa uma consulta com tratamento de erros
 * 
 * @param queryFn Função que executa a consulta
 * @returns Resultado da consulta
 */
export async function executeQuery<T>(
  queryFn: () => Promise<T>
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("Erro ao executar consulta:", error);
    throw error;
  }
}
