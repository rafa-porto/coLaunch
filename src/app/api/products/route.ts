import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { product, productTag } from "@/db/schema";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, tagline, description, websiteUrl, githubUrl, categoryId, tags, thumbnail, images, slug } = body;
    
    // Validação básica
    if (!title || !tagline || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }
    
    // Verificar se o slug já existe
    const existingProduct = await db.query.product.findFirst({
      where: (fields, { eq }) => eq(fields.slug, slug)
    });
    
    if (existingProduct) {
      // Adicionar um sufixo numérico ao slug
      const timestamp = Date.now().toString().slice(-4);
      body.slug = `${slug}-${timestamp}`;
    }
    
    // Inserir o produto
    const [newProduct] = await db.insert(product).values({
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
      updatedAt: new Date()
    }).returning();
    
    // Inserir tags
    if (tags && tags.length > 0) {
      const tagValues = tags.map((tag: string) => ({
        productId: newProduct.id,
        name: tag,
        createdAt: new Date()
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
