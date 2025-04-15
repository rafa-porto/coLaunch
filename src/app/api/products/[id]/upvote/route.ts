import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleUpvote } from "@/db/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Obter os headers da requisição
    const requestHeaders = new Headers(request.headers);

    // Obter a sessão usando os headers da requisição
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID de produto inválido" },
        { status: 400 }
      );
    }

    const hasUpvoted = await toggleUpvote(productId, session.user.id);

    return NextResponse.json({ hasUpvoted });
  } catch (error) {
    console.error("Erro ao processar upvote:", error);
    return NextResponse.json(
      { error: "Erro ao processar upvote" },
      { status: 500 }
    );
  }
}
