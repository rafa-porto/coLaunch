"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  ChevronRight,
  Package,
  ExternalLink,
} from "lucide-react";

interface HomeProductCardProps {
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
}

export function HomeProductCard({ product, featured = false }: HomeProductCardProps) {
  return (
    <Card className={`bg-card/80 backdrop-blur-sm border-border overflow-hidden transition-all hover:shadow-lg group ${featured ? 'border-primary/30 shadow-md' : 'hover:border-primary/50'}`}>
      <div className="relative">
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
              <span>Featured</span>
            </div>
          </div>
        )}
        
        {product.thumbnail ? (
          <div className="relative h-48 w-full">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="h-48 w-full bg-primary/5 flex items-center justify-center">
            <Package className="h-12 w-12 text-primary/30" />
          </div>
        )}

        {/* Stats overlay */}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{product.upvoteCount}</span>
          </div>
          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{product.commentCount}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-lg">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-primary transition-colors duration-300"
          >
            {product.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {product.tagline}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between items-center pt-0 pb-4">
        <div className="flex items-center gap-2">
          {product.user?.image ? (
            <div className="relative w-8 h-8">
              <Image
                src={product.user.image}
                alt={product.user.name}
                width={32}
                height={32}
                className="rounded-full border border-border/50"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {product.user?.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            {product.user?.name || "Anonymous"}
          </span>
        </div>

        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-primary/5 h-8 px-2 transition-all duration-300"
        >
          <Link href={`/products/${product.slug}`}>
            View
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
