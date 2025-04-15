import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { product, productTag, upvote, comment } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Rota para excluir um produto
export async function DELETE(
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

    // Verificar se o produto existe e pertence ao usuário
    const existingProduct = await db.query.product.findFirst({
      where: eq(product.id, productId),
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o proprietário do produto
    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir este produto" },
        { status: 403 }
      );
    }

    // Excluir registros relacionados
    // As tags, upvotes e comentários serão excluídos automaticamente devido à restrição ON DELETE CASCADE

    // Excluir o produto
    await db.delete(product).where(eq(product.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}

// Rota para obter um produto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID de produto inválido" },
        { status: 400 }
      );
    }

    const productData = await db.query.product.findFirst({
      where: eq(product.id, productId),
      with: {
        user: true,
        category: true,
      },
    });

    if (!productData) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(productData);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

// Rota para atualizar um produto
export async function PUT(
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

    // Verificar se o produto existe e pertence ao usuário
    const existingProduct = await db.query.product.findFirst({
      where: eq(product.id, productId),
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o proprietário do produto
    if (existingProduct.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para atualizar este produto" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      tagline,
      description,
      websiteUrl,
      githubUrl,
      categoryId,
      tags,
      thumbnail,
      images,
      slug,
    } = body;

    // Validação básica
    if (!title || !tagline || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Verificar se o slug já existe (exceto para o produto atual)
    const slugExists = await db.query.product.findFirst({
      where: (fields, { eq, and, ne }) =>
        and(eq(fields.slug, slug), ne(fields.id, productId)),
    });

    let finalSlug = slug;
    if (slugExists) {
      // Adicionar um sufixo numérico ao slug
      const timestamp = Date.now().toString().slice(-4);
      finalSlug = `${slug}-${timestamp}`;
    }

    // Atualizar o produto
    const [updatedProduct] = await db
      .update(product)
      .set({
        title,
        slug: finalSlug,
        tagline,
        description,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        thumbnail: thumbnail || null,
        images: images || [],
        categoryId: categoryId ? parseInt(categoryId) : null,
        updatedAt: new Date(),
      })
      .where(eq(product.id, productId))
      .returning();

    // Atualizar tags
    if (tags && Array.isArray(tags)) {
      // Remover tags existentes
      await db.delete(productTag).where(eq(productTag.productId, productId));

      // Adicionar novas tags
      if (tags.length > 0) {
        const tagValues = tags.map((tag: string) => ({
          productId,
          name: tag,
          createdAt: new Date(),
        }));

        await db.insert(productTag).values(tagValues);
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}
