"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, ExternalLink, Package } from "lucide-react";

interface ProductHuntStyleCardProps {
  product: {
    id: number;
    title: string;
    slug: string;
    tagline: string;
    thumbnail: string | null;
    upvoteCount: number;
    commentCount: number;
    user?: {
      name: string;
      image: string;
    };
  };
  featured?: boolean;
  index?: number;
}

export function ProductHuntStyleCard({ 
  product, 
  featured = false,
  index
}: ProductHuntStyleCardProps) {
  return (
    <div className={`group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all ${featured ? 'border-primary/30 shadow-sm' : ''}`}>
      {/* Número do produto (opcional) */}
      {index !== undefined && (
        <div className="hidden sm:flex items-center justify-center w-8 h-8 text-lg font-semibold text-muted-foreground">
          {index + 1}
        </div>
      )}
      
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <div className="relative w-full sm:w-16 h-16 rounded-lg overflow-hidden border border-border/40">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-primary/5 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary/30" />
            </div>
          )}
          
          {featured && (
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-primary-foreground px-1.5 py-0.5 text-[10px] font-medium">
                Featured
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h3 className="font-medium text-foreground line-clamp-1">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-primary transition-colors duration-300"
            >
              {product.title}
            </Link>
          </h3>
          
          {/* Botões de ação em telas pequenas */}
          <div className="flex sm:hidden items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 py-0 border-border/60 bg-background/50 hover:bg-primary/5"
            >
              <ThumbsUp className="h-3.5 w-3.5 text-primary" />
              <span className="ml-1 text-xs">{product.upvoteCount}</span>
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.tagline}
        </p>
        
        <div className="flex items-center justify-between">
          {/* Informações do usuário */}
          <div className="flex items-center gap-2">
            {product.user?.image ? (
              <div className="relative w-6 h-6">
                <Image
                  src={product.user.image}
                  alt={product.user.name}
                  width={24}
                  height={24}
                  className="rounded-full border border-border/50"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-primary">
                  {product.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {product.user?.name || "Anonymous"}
            </span>
          </div>
          
          {/* Estatísticas e ações */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{product.commentCount}</span>
            </div>
            
            {/* Botão de upvote em telas maiores */}
            <div className="hidden sm:block">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 py-0 border-border/60 bg-background/50 hover:bg-primary/5"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span>{product.upvoteCount}</span>
              </Button>
            </div>
            
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              <Link href={`/products/${product.slug}`}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
