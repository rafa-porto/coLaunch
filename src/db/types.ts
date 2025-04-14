import { InferSelectModel } from 'drizzle-orm';
import { 
  user, 
  product, 
  category, 
  comment, 
  upvote, 
  productTag 
} from './schema';

// Tipos inferidos das tabelas
export type User = InferSelectModel<typeof user>;
export type Product = InferSelectModel<typeof product>;
export type Category = InferSelectModel<typeof category>;
export type Comment = InferSelectModel<typeof comment>;
export type Upvote = InferSelectModel<typeof upvote>;
export type ProductTag = InferSelectModel<typeof productTag>;

// Tipos para formulários e API
export type ProductFormData = {
  title: string;
  tagline: string;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  categoryId?: number;
  tags: string[];
  thumbnail?: string;
  images?: string[];
};

export type CommentFormData = {
  content: string;
  productId: number;
  parentId?: number;
};

export type UserProfileFormData = {
  name: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
};

// Tipos para respostas da API
export type ProductWithRelations = Product & {
  user: User;
  category?: Category;
  tags?: ProductTag[];
  upvoteCount: number;
  commentCount: number;
  hasUpvoted?: boolean;
};

export type CommentWithUser = Comment & {
  user: User;
  replies?: CommentWithUser[];
};
