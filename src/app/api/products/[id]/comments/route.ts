import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { comment, product } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Conteúdo do comentário é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o produto existe
    const productExists = await db.query.product.findFirst({
      where: eq(product.id, productId),
    });

    if (!productExists) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o parentId existe, se fornecido
    if (parentId) {
      const parentExists = await db.query.comment.findFirst({
        where: eq(comment.id, parentId),
      });

      if (!parentExists) {
        return NextResponse.json(
          { error: "Comentário pai não encontrado" },
          { status: 404 }
        );
      }
    }

    // Inserir o comentário
    const [newComment] = await db
      .insert(comment)
      .values({
        content: content.trim(),
        productId,
        userId: session.user.id,
        parentId: parentId || null,
      })
      .returning();

    // Atualizar o contador de comentários do produto
    await db
      .update(product)
      .set({ commentCount: sql`${product.commentCount} + 1` })
      .where(eq(product.id, productId));

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
}
