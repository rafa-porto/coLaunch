// import { getProducts, getAllCategories } from "@/db/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extrair parâmetros de busca
  const categorySlug =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const featured = searchParams.featured === "true";
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const products = [];
  const categories = [];

  return (
    <div className="bg-[#242424] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar com filtros */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Categorias
              </h3>
              <div className="space-y-2">
                <Button
                  variant={!categorySlug ? "default" : "outline"}
                  className={
                    !categorySlug
                      ? "bg-[#b17f01] w-full justify-start"
                      : "w-full justify-start text-[#7a7a7a]"
                  }
                  asChild
                >
                  <Link href="/products">Todas</Link>
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      categorySlug === category.slug ? "default" : "outline"
                    }
                    className={
                      categorySlug === category.slug
                        ? "bg-[#b17f01] w-full justify-start"
                        : "w-full justify-start text-[#7a7a7a]"
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
          </div>

          {/* Lista de produtos */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                {featured ? "Produtos em Destaque" : "Todos os Produtos"}
              </h1>
              <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
                <Link href="/dashboard/products/new">Enviar Produto</Link>
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#7a7a7a]">Nenhum produto encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-[#2a2a2a] border-[#424242] overflow-hidden hover:border-[#b17f01] transition-all"
                  >
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
                      <CardTitle className="text-white">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-[#b17f01]"
                        >
                          {product.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-[#7a7a7a]">
                        {product.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {product.user?.image && (
                          <Image
                            src={product.user.image}
                            alt={product.user.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm text-[#7a7a7a]">
                          {product.user?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#7a7a7a]">
                        <span>⬆️</span>
                        <span>{product.upvoteCount}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Paginação */}
            <div className="mt-8 flex justify-center">
              {page > 1 && (
                <Button
                  variant="outline"
                  className="mr-2 border-[#424242] text-[#7a7a7a]"
                  asChild
                >
                  <Link
                    href={`/products?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  >
                    Anterior
                  </Link>
                </Button>
              )}

              {products.length === limit && (
                <Button
                  variant="outline"
                  className="border-[#424242] text-[#7a7a7a]"
                  asChild
                >
                  <Link
                    href={`/products?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  >
                    Próxima
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
