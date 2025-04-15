import { db } from "./drizzle";
import { product, category, user, upvote, comment, productTag } from "./schema";
import { eq, desc, asc, and, sql, like, or } from "drizzle-orm";
import { ProductWithRelations, CommentWithUser } from "./types";

// Funções para produtos
export async function getProducts(limit = 10, offset = 0, orderBy = "newest") {
  const orderClause =
    orderBy === "newest"
      ? desc(product.createdAt)
      : orderBy === "popular"
        ? desc(product.upvoteCount)
        : desc(product.createdAt);

  const products = await db.query.product.findMany({
    limit,
    offset,
    orderBy: [orderClause],
    where: eq(product.status, "approved"),
    with: {
      user: true,
      category: true,
    },
  });

  return products;
}

export async function getFeaturedProducts(limit = 5) {
  const products = await db.query.product.findMany({
    limit,
    where: and(eq(product.status, "approved"), eq(product.featured, true)),
    orderBy: [desc(product.createdAt)],
    with: {
      user: true,
      category: true,
    },
  });

  return products;
}

export async function getProductBySlug(
  slug: string,
  userId?: string
): Promise<ProductWithRelations | null> {
  const result = await db.query.product.findFirst({
    where: eq(product.slug, slug),
    with: {
      user: true,
      category: true,
    },
  });

  if (!result) return null;

  // Buscar tags
  const tags = await db.query.productTag.findMany({
    where: eq(productTag.productId, result.id),
  });

  // Verificar se o usuário deu upvote
  let hasUpvoted = false;
  if (userId) {
    const userUpvote = await db.query.upvote.findFirst({
      where: and(eq(upvote.productId, result.id), eq(upvote.userId, userId)),
    });
    hasUpvoted = !!userUpvote;
  }

  return {
    ...result,
    tags,
    hasUpvoted,
  };
}

export async function getProductsByCategory(
  categorySlug: string,
  limit = 10,
  offset = 0
) {
  const categoryResult = await db.query.category.findFirst({
    where: eq(category.slug, categorySlug),
  });

  if (!categoryResult) return [];

  const products = await db.query.product.findMany({
    limit,
    offset,
    where: and(
      eq(product.categoryId, categoryResult.id),
      eq(product.status, "approved")
    ),
    orderBy: [desc(product.createdAt)],
    with: {
      user: true,
      category: true,
    },
  });

  return products;
}

export async function searchProducts(query: string, limit = 10, offset = 0) {
  const searchTerm = `%${query}%`;

  const products = await db.query.product.findMany({
    limit,
    offset,
    where: and(
      eq(product.status, "approved"),
      or(
        like(product.title, searchTerm),
        like(product.description, searchTerm),
        like(product.tagline, searchTerm)
      )
    ),
    orderBy: [desc(product.createdAt)],
    with: {
      user: true,
      category: true,
    },
  });

  return products;
}

// Funções para comentários
export async function getProductComments(
  productId: number
): Promise<CommentWithUser[]> {
  try {
    // Usar uma abordagem mais simples sem relações para evitar problemas
    const allComments = await db
      .select({
        id: comment.id,
        content: comment.content,
        productId: comment.productId,
        userId: comment.userId,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })
      .from(comment)
      .where(eq(comment.productId, productId))
      .orderBy(desc(comment.createdAt));

    // Buscar usuários para todos os comentários de uma vez
    const userIds = [...new Set(allComments.map((c) => c.userId))];

    // Definir um tipo para os usuários baseado no esquema
    type UserType = typeof user.$inferSelect;
    let users: UserType[] = [];

    // Buscar cada usuário individualmente para evitar problemas
    for (const uid of userIds) {
      const foundUsers = await db.select().from(user).where(eq(user.id, uid));
      users = [...users, ...foundUsers];
    }

    // Criar um mapa de usuários para acesso rápido
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Adicionar informações de usuário aos comentários e converter datas
    const commentsWithUsers = allComments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      user: userMap.get(c.userId)
        ? {
            ...userMap.get(c.userId),
            createdAt: userMap.get(c.userId)?.createdAt.toISOString() || "",
            updatedAt: userMap.get(c.userId)?.updatedAt.toISOString() || "",
            emailVerified: userMap.get(c.userId)?.emailVerified || false,
          }
        : null,
    }));

    // Separar comentários raiz e respostas
    const rootComments = commentsWithUsers.filter((c) => !c.parentId);
    const replies = commentsWithUsers.filter((c) => c.parentId);

    // Definir um tipo para os comentários com usuário
    type CommentWithUserType = (typeof commentsWithUsers)[0];

    // Criar um mapa de respostas por ID do comentário pai
    const repliesByParentId = new Map<number, CommentWithUserType[]>();

    // Agrupar respostas por ID do pai
    for (const reply of replies) {
      if (reply.parentId) {
        if (!repliesByParentId.has(reply.parentId)) {
          repliesByParentId.set(reply.parentId, []);
        }
        repliesByParentId.get(reply.parentId)?.push(reply);
      }
    }

    // Organizar respostas por comentário pai
    const commentsWithReplies = rootComments.map((rootComment) => {
      const commentReplies = repliesByParentId.get(rootComment.id) || [];

      // Ordenar respostas por data de criação (mais antigas primeiro)
      commentReplies.sort((a, b) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      return {
        ...rootComment,
        replies: commentReplies,
      } as CommentWithUser;
    });

    return commentsWithReplies;
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return [];
  }
}

// Funções para categorias
export async function getAllCategories() {
  return db.query.category.findMany({
    orderBy: [asc(category.name)],
  });
}

// Funções para upvotes
export async function toggleUpvote(productId: number, userId: string) {
  // Verificar se já existe um upvote
  const existingUpvote = await db.query.upvote.findFirst({
    where: and(eq(upvote.productId, productId), eq(upvote.userId, userId)),
  });

  if (existingUpvote) {
    // Remover upvote
    await db.delete(upvote).where(eq(upvote.id, existingUpvote.id));

    // Atualizar contador
    await db
      .update(product)
      .set({ upvoteCount: sql`${product.upvoteCount} - 1` })
      .where(eq(product.id, productId));

    return false; // Upvote removido
  } else {
    // Adicionar upvote
    await db.insert(upvote).values({
      productId,
      userId,
    });

    // Atualizar contador
    await db
      .update(product)
      .set({ upvoteCount: sql`${product.upvoteCount} + 1` })
      .where(eq(product.id, productId));

    return true; // Upvote adicionado
  }
}

// Funções para usuários
export async function getUserProfile(userId: string) {
  const profile = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!profile) return null;

  // Converter datas para strings para evitar problemas de serialização
  return {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export async function getUserProducts(userId: string) {
  try {
    // Usar uma abordagem mais simples sem relações para evitar problemas
    const products = await db
      .select({
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        tagline: product.tagline,
        thumbnail: product.thumbnail,
        websiteUrl: product.websiteUrl,
        githubUrl: product.githubUrl,
        categoryId: product.categoryId,
        userId: product.userId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        publishedAt: product.publishedAt,
        featured: product.featured,
        upvoteCount: product.upvoteCount,
        commentCount: product.commentCount,
      })
      .from(product)
      .where(eq(product.userId, userId))
      .orderBy(desc(product.createdAt));

    // Buscar categorias separadamente se houver produtos com categorias
    const categoryIds = products
      .filter((p) => p.categoryId !== null)
      .map((p) => p.categoryId as number);

    const uniqueCategoryIds = [...new Set(categoryIds)];

    // Definir um tipo para as categorias baseado no esquema
    type CategoryType = typeof category.$inferSelect;
    let categories: CategoryType[] = [];
    if (uniqueCategoryIds.length > 0) {
      // Buscar cada categoria individualmente para evitar problemas com o operador OR
      for (const catId of uniqueCategoryIds) {
        const cats = await db
          .select()
          .from(category)
          .where(eq(category.id, catId));
        categories = [...categories, ...cats];
      }
    }

    // Criar um mapa de categorias para acesso rápido
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Converter datas para strings e adicionar categorias
    return products.map((product) => ({
      ...product,
      website: product.websiteUrl, // Manter compatibilidade com o código existente
      github: product.githubUrl, // Manter compatibilidade com o código existente
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      publishedAt: product.publishedAt
        ? product.publishedAt.toISOString()
        : null,
      category:
        product.categoryId && categoryMap.has(product.categoryId)
          ? {
              ...categoryMap.get(product.categoryId),
              createdAt:
                categoryMap.get(product.categoryId)?.createdAt?.toISOString() ||
                null,
              updatedAt:
                categoryMap.get(product.categoryId)?.updatedAt?.toISOString() ||
                null,
            }
          : null,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos do usuário:", error);
    return [];
  }
}
