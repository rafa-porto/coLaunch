import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { product, productTag } from "@/db/schema";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
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
      publishedAt,
    } = body;

    // Validação básica
    if (!title || !tagline || !description || !publishedAt) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Validar que a data de lançamento não é o dia atual ou anterior
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const publishDate = new Date(publishedAt);
    publishDate.setHours(0, 0, 0, 0);

    if (publishDate <= today) {
      return NextResponse.json(
        {
          error:
            "A data de lançamento deve ser uma data futura (não pode ser hoje)",
        },
        { status: 400 }
      );
    }

    // Verificar se o slug já existe
    const existingProduct = await db.query.product.findFirst({
      where: (fields, { eq }) => eq(fields.slug, slug),
    });

    if (existingProduct) {
      // Adicionar um sufixo numérico ao slug
      const timestamp = Date.now().toString().slice(-4);
      body.slug = `${slug}-${timestamp}`;
    }

    // Inserir o produto
    const [newProduct] = await db
      .insert(product)
      .values({
        title,
        slug: body.slug,
        tagline,
        description,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        thumbnail: thumbnail || null,
        images: images || [],
        categoryId: categoryId ? parseInt(categoryId) : null,
        userId: session.user.id,
        status: "pending", // Produtos começam como pendentes para moderação
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(publishedAt),
      })
      .returning();

    // Inserir tags
    if (tags && tags.length > 0) {
      const tagValues = tags.map((tag: string) => ({
        productId: newProduct.id,
        name: tag,
        createdAt: new Date(),
      }));

      await db.insert(productTag).values(tagValues);
    }

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
