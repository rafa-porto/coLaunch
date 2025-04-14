import { db } from './drizzle';
import { 
  product, 
  category, 
  user, 
  upvote, 
  comment, 
  productTag 
} from './schema';
import { eq, desc, asc, and, sql, count, isNull, like, or } from 'drizzle-orm';
import { ProductWithRelations, CommentWithUser } from './types';

// Funções para produtos
export async function getProducts(limit = 10, offset = 0, orderBy = 'newest') {
  const orderClause = orderBy === 'newest' 
    ? desc(product.createdAt) 
    : orderBy === 'popular' 
      ? desc(product.upvoteCount) 
      : desc(product.createdAt);

  const products = await db.query.product.findMany({
    limit,
    offset,
    orderBy: [orderClause],
    where: eq(product.status, 'approved'),
    with: {
      user: true,
      category: true,
    }
  });

  return products;
}

export async function getFeaturedProducts(limit = 5) {
  const products = await db.query.product.findMany({
    limit,
    where: and(
      eq(product.status, 'approved'),
      eq(product.featured, true)
    ),
    orderBy: [desc(product.createdAt)],
    with: {
      user: true,
      category: true,
    }
  });

  return products;
}

export async function getProductBySlug(slug: string, userId?: string): Promise<ProductWithRelations | null> {
  const result = await db.query.product.findFirst({
    where: eq(product.slug, slug),
    with: {
      user: true,
      category: true,
    }
  });

  if (!result) return null;

  // Buscar tags
  const tags = await db.query.productTag.findMany({
    where: eq(productTag.productId, result.id)
  });

  // Verificar se o usuário deu upvote
  let hasUpvoted = false;
  if (userId) {
    const userUpvote = await db.query.upvote.findFirst({
      where: and(
        eq(upvote.productId, result.id),
        eq(upvote.userId, userId)
      )
    });
    hasUpvoted = !!userUpvote;
  }

  return {
    ...result,
    tags,
    hasUpvoted
  };
}

export async function getProductsByCategory(categorySlug: string, limit = 10, offset = 0) {
  const categoryResult = await db.query.category.findFirst({
    where: eq(category.slug, categorySlug)
  });

  if (!categoryResult) return [];

  const products = await db.query.product.findMany({
    limit,
    offset,
    where: and(
      eq(product.categoryId, categoryResult.id),
      eq(product.status, 'approved')
    ),
    orderBy: [desc(product.createdAt)],
    with: {
      user: true,
      category: true,
    }
  });

  return products;
}

export async function searchProducts(query: string, limit = 10, offset = 0) {
  const searchTerm = `%${query}%`;
  
  const products = await db.query.product.findMany({
    limit,
    offset,
    where: and(
      eq(product.status, 'approved'),
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
    }
  });

  return products;
}

// Funções para comentários
export async function getProductComments(productId: number): Promise<CommentWithUser[]> {
  // Buscar comentários de primeiro nível
  const rootComments = await db.query.comment.findMany({
    where: and(
      eq(comment.productId, productId),
      isNull(comment.parentId)
    ),
    orderBy: [desc(comment.createdAt)],
    with: {
      user: true
    }
  });

  // Buscar respostas para cada comentário
  const commentsWithReplies: CommentWithUser[] = [];
  
  for (const rootComment of rootComments) {
    const replies = await db.query.comment.findMany({
      where: eq(comment.parentId, rootComment.id),
      orderBy: [asc(comment.createdAt)],
      with: {
        user: true
      }
    });
    
    commentsWithReplies.push({
      ...rootComment,
      replies
    });
  }

  return commentsWithReplies;
}

// Funções para categorias
export async function getAllCategories() {
  return db.query.category.findMany({
    orderBy: [asc(category.name)]
  });
}

// Funções para upvotes
export async function toggleUpvote(productId: number, userId: string) {
  // Verificar se já existe um upvote
  const existingUpvote = await db.query.upvote.findFirst({
    where: and(
      eq(upvote.productId, productId),
      eq(upvote.userId, userId)
    )
  });

  if (existingUpvote) {
    // Remover upvote
    await db.delete(upvote).where(eq(upvote.id, existingUpvote.id));
    
    // Atualizar contador
    await db.update(product)
      .set({ upvoteCount: sql`${product.upvoteCount} - 1` })
      .where(eq(product.id, productId));
      
    return false; // Upvote removido
  } else {
    // Adicionar upvote
    await db.insert(upvote).values({
      productId,
      userId
    });
    
    // Atualizar contador
    await db.update(product)
      .set({ upvoteCount: sql`${product.upvoteCount} + 1` })
      .where(eq(product.id, productId));
      
    return true; // Upvote adicionado
  }
}

// Funções para usuários
export async function getUserProfile(userId: string) {
  return db.query.user.findFirst({
    where: eq(user.id, userId)
  });
}

export async function getUserProducts(userId: string) {
  return db.query.product.findMany({
    where: eq(product.userId, userId),
    orderBy: [desc(product.createdAt)],
    with: {
      category: true
    }
  });
}
