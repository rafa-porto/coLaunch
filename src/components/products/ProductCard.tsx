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
import { ThumbsUp, MessageSquare, Edit, Trash2 } from "lucide-react";
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
      <Card className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-md">
        {product.thumbnail && (
          <div className="relative h-48 w-full">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-foreground">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-primary"
            >
              {product.title}
            </Link>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {product.tagline}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{product.upvoteCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{product.commentCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
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
