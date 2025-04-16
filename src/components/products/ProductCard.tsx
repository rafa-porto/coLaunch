"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  Edit,
  Trash2,
  ChevronRight,
  Package,
} from "lucide-react";
import { DeleteProductDialog } from "./DeleteProductDialog";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    slug: string;
    tagline: string;
    thumbnail: string | null;
    upvoteCount: number;
    commentCount: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden hover:border-primary transition-all hover:shadow-lg group">
        <div className="relative">
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
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300 h-8 px-2"
            >
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300 h-8 w-8 p-0"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete product"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <Link href={`/products/${product.slug}`}>
              View
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <DeleteProductDialog
        productId={product.id}
        productTitle={product.title}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
