// import { getProducts, getAllCategories } from "@/db/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductHuntStyleCard } from "@/components/products/ProductHuntStyleCard";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  Package,
  Sparkles,
  Grid,
  List,
  PlusCircle,
  Tag,
  ThumbsUp,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  thumbnail: string | null;
  upvoteCount: number;
  commentCount: number;
  createdAt?: string;
  user?: {
    name: string;
    image: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Aguardar a resolução da Promise de searchParams
  const resolvedParams = await searchParams;

  // Extrair parâmetros de busca de forma segura
  const categorySlug =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;
  const featured = resolvedParams.featured === "true";
  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  const viewMode =
    typeof resolvedParams.view === "string" ? resolvedParams.view : "list";
  const sortBy =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";

  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const products: Product[] = [];
  const categories: { id: number; name: string; slug: string }[] = [];

  return (
    <div className="bg-background min-h-screen">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent opacity-70"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {featured ? "Featured Products" : "Explore Products"}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {featured
              ? "Discover the most popular products selected by our team"
              : "Browse all products shared by our community of makers and developers"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com filtros */}
          <div className="w-full lg:w-64 space-y-6 order-2 lg:order-1">
            <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="text-base font-medium text-foreground">
                  Filters
                </h3>
              </div>

              <div className="space-y-5">
                {/* Categorias */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span>Categories</span>
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant={!categorySlug ? "default" : "outline"}
                      size="sm"
                      className={
                        !categorySlug
                          ? "bg-primary/10 text-primary hover:bg-primary/20 w-full justify-start font-normal"
                          : "w-full justify-start text-muted-foreground font-normal hover:bg-primary/5"
                      }
                      asChild
                    >
                      <Link href="/products">All Categories</Link>
                    </Button>

                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          categorySlug === category.slug ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          categorySlug === category.slug
                            ? "bg-primary/10 text-primary hover:bg-primary/20 w-full justify-start font-normal"
                            : "w-full justify-start text-muted-foreground font-normal hover:bg-primary/5"
                        }
                        asChild
                      >
                        <Link href={`/products?category=${category.slug}`}>
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Ordenação */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                    <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                    <span>Sort By</span>
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant={sortBy === "newest" ? "default" : "outline"}
                      size="sm"
                      className={
                        sortBy === "newest"
                          ? "bg-primary/10 text-primary hover:bg-primary/20 w-full justify-start font-normal"
                          : "w-full justify-start text-muted-foreground font-normal hover:bg-primary/5"
                      }
                      asChild
                    >
                      <Link
                        href={`/products${categorySlug ? `?category=${categorySlug}&sort=newest` : "?sort=newest"}`}
                      >
                        Newest First
                      </Link>
                    </Button>

                    <Button
                      variant={sortBy === "popular" ? "default" : "outline"}
                      size="sm"
                      className={
                        sortBy === "popular"
                          ? "bg-primary/10 text-primary hover:bg-primary/20 w-full justify-start font-normal"
                          : "w-full justify-start text-muted-foreground font-normal hover:bg-primary/5"
                      }
                      asChild
                    >
                      <Link
                        href={`/products${categorySlug ? `?category=${categorySlug}&sort=popular` : "?sort=popular"}`}
                      >
                        Most Popular
                      </Link>
                    </Button>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Visualização */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                    <Grid className="h-3.5 w-3.5 text-primary" />
                    <span>View Mode</span>
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      className={
                        viewMode === "list"
                          ? "bg-primary/10 text-primary hover:bg-primary/20 flex-1 font-normal"
                          : "flex-1 text-muted-foreground font-normal hover:bg-primary/5"
                      }
                      asChild
                    >
                      <Link
                        href={`/products${categorySlug ? `?category=${categorySlug}&view=list` : "?view=list"}`}
                      >
                        <List className="h-4 w-4 mr-1" />
                        List
                      </Link>
                    </Button>

                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      className={
                        viewMode === "grid"
                          ? "bg-primary/10 text-primary hover:bg-primary/20 flex-1 font-normal"
                          : "flex-1 text-muted-foreground font-normal hover:bg-primary/5"
                      }
                      asChild
                    >
                      <Link
                        href={`/products${categorySlug ? `?category=${categorySlug}&view=grid` : "?view=grid"}`}
                      >
                        <Grid className="h-4 w-4 mr-1" />
                        Grid
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {products.length} products found
                </span>
              </div>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300 gap-2"
              >
                <Link href="/submit-product">
                  <PlusCircle className="h-4 w-4" />
                  Submit Product
                </Link>
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8 text-center shadow-md">
                <div className="bg-primary/10 p-4 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary/70" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  {categorySlug
                    ? "There are no products in this category yet."
                    : "Be the first to share your amazing product with our community!"}
                </p>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 gap-2"
                >
                  <Link href="/submit-product">
                    <PlusCircle className="h-4 w-4" />
                    Submit Your Product
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <ProductHuntStyleCard
                        key={product.id}
                        product={product}
                        index={index}
                        featured={featured && index === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="relative h-48 w-full">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                              <Package className="h-12 w-12 text-primary/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-foreground mb-1">
                            <Link
                              href={`/products/${product.slug}`}
                              className="hover:text-primary transition-colors duration-300"
                            >
                              {product.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {product.tagline}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {product.user?.image ? (
                                <Image
                                  src={product.user.image}
                                  alt={product.user.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {product.user?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {product.user?.name || "Anonymous"}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 py-0 border-border/60 bg-background/50 hover:bg-primary/5"
                            >
                              <ThumbsUp className="h-3.5 w-3.5 text-primary mr-1.5" />
                              <span>{product.upvoteCount}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Paginação */}
            {products.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Button
                    variant="outline"
                    className="border-border/60 text-foreground hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link
                      href={`/products?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${viewMode !== "list" ? `&view=${viewMode}` : ""}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}`}
                    >
                      Previous
                    </Link>
                  </Button>
                )}

                {products.length === limit && (
                  <Button
                    variant="outline"
                    className="border-border/60 text-foreground hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link
                      href={`/products?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${viewMode !== "list" ? `&view=${viewMode}` : ""}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
