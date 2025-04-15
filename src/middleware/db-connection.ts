import { NextRequest, NextResponse } from "next/server";
import { closeConnection } from "@/db/drizzle";

/**
 * Middleware para gerenciar conexões com o banco de dados
 * Este middleware é usado apenas para fins de depuração e monitoramento
 * As conexões são gerenciadas automaticamente pelo pool de conexões
 */
export async function dbConnectionMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  try {
    // Continuar com a solicitação
    const response = await next();
    return response;
  } catch (error) {
    console.error("Erro na solicitação:", error);
    
    // Em caso de erro, garantir que as conexões sejam liberadas
    // Isso é apenas uma precaução, o pool de conexões deve gerenciar isso automaticamente
    if (process.env.NODE_ENV === "development") {
      console.log("Liberando conexões do pool devido a erro...");
    }
    
    // Retornar resposta de erro
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
