import { getProductBySlug, getProductComments } from "@/db/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { CommentSection } from "@/components/comments/CommentSection";
import { UpvoteButton } from "@/components/products/UpvoteButton";
import { formatDate } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const product = await getProductBySlug(params.slug, userId);

  if (!product || product.status !== "approved") {
    notFound();
  }

  const comments = await getProductComments(product.id);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="md:col-span-2 space-y-8">
            {/* Cabeçalho do produto */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {product.tagline}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {product.user.image && (
                    <Image
                      src={product.user.image}
                      alt={product.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-muted-foreground">
                    Por{" "}
                    <Link
                      href={`/users/${product.user.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.user.name}
                    </Link>
                  </span>
                </div>

                <span className="text-muted-foreground">
                  {formatDate(product.createdAt)}
                </span>
              </div>

              {/* Imagem principal */}
              {product.thumbnail && (
                <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Galeria de imagens */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-24 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Descrição */}
              <div className="prose prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Seção de comentários */}
            <CommentSection
              productId={product.id}
              comments={comments}
              isLoggedIn={!!session}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de upvote */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-center">
                  <span className="text-3xl">{product.upvoteCount}</span>
                  <span className="block text-sm text-muted-foreground">
                    upvotes
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UpvoteButton
                  productId={product.id}
                  hasUpvoted={product.hasUpvoted || false}
                  isLoggedIn={!!session}
                />
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.websiteUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-border text-muted-foreground"
                  >
                    <a
                      href={product.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visitar Website
                    </a>
                  </Button>
                )}

                {product.githubUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-border text-muted-foreground"
                  >
                    <a
                      href={product.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Categoria */}
            {product.category && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-primary hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
