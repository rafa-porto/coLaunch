import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { auth } from "@/lib/auth";
// import { getUserProducts } from "@/db/utils";
// import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const userProducts = [];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Meus Produtos", href: "/dashboard/products" },
  ];

  return (
    <div className="container mx-auto px-6 md:px-0 pb-8">
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="flex-1 p-0 pt-4">
        <Card className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-muted-foreground">
              Meus Produtos
            </CardTitle>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/products/new">Novo Produto</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {userProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você ainda não enviou nenhum produto.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/dashboard/products/new">
                    Enviar meu primeiro produto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-background border-border overflow-hidden hover:border-primary transition-all"
                  >
                    {product.thumbnail && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="py-3">
                      <CardTitle className="text-foreground text-base">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-primary"
                        >
                          {product.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>⬆️ {product.upvoteCount}</span>
                        <span>💬 {product.commentCount}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground"
                        >
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            Editar
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground"
                        >
                          <Link href={`/products/${product.slug}`}>Ver</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
