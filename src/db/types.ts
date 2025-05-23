import { InferSelectModel } from "drizzle-orm";
import { user, product, category, comment, upvote, productTag } from "./schema";

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
  publishedAt?: string; // Data de lançamento agendado
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

// Tipo para comentários com usuário e respostas
export type CommentWithUser = {
  id: number;
  content: string;
  productId: number;
  userId: string;
  parentId: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    bio: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    isAdmin: boolean | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  } | null;
  replies?: any[];
};
