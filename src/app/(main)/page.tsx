import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const featuredProducts = [];
  const recentProducts = [];

  return (
    <div className="min-h-screen bg-[#242424] text-white">
      <div className="absolute inset-0 overflow-hidden">
        {/* Top left orbs gradient background */}
        <div className="absolute top-0 left-0 w-[800px] h-[600px]">
          <Image
            src="/images/gradient-orb.png"
            alt="Background gradient top left"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        {/* Bottom right orbs gradient background */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px]">
          <Image
            src="/images/gradient-orb2.png"
            alt="Background gradient bottom right"
            fill
            className="object-cover opacity-20 rotate-180"
            priority
          />
        </div>
        {/* Subtle dots overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Hero Section */}
      <main className="relative max-w-6xl mx-auto px-6 pt-[100px]">
        <div className="space-y-8 text-center">
          <h1 className="font-bold text-5xl md:text-6xl tracking-[-0.02em] leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-[#b17f01] via-[#7a7a7a] to-[#a600c3]">
            coLaunch
          </h1>

          <p className="text-xl text-[#7a7a7a] max-w-xl mx-auto">
            Descubra, compartilhe e vote nos melhores produtos digitais criados
            por desenvolvedores e makers.
          </p>

          <div className="flex justify-center gap-4">
            <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
              <Link href="/products">Explorar Produtos</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#7a7a7a] text-[#7a7a7a] hover:bg-[#3a3a3a]"
            >
              <Link href="/dashboard/products/new">Enviar Produto</Link>
            </Button>
          </div>
        </div>

        {/* Featured Products */}
        <section className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Em Destaque</h2>
            <Link
              href="/products?featured=true"
              className="text-[#b17f01] hover:underline"
            >
              Ver todos
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-[#2a2a2a] border border-[#424242] rounded-lg p-8 text-center">
              <p className="text-[#7a7a7a] mb-4">
                Nenhum produto em destaque no momento.
              </p>
              <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
                <Link href="/dashboard/products/new">
                  Seja o primeiro a enviar um produto
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
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
        </section>

        {/* Recent Products */}
        <section className="mt-20 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recentes</h2>
            <Link href="/products" className="text-[#b17f01] hover:underline">
              Ver todos
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="bg-[#2a2a2a] border border-[#424242] rounded-lg p-8 text-center">
              <p className="text-[#7a7a7a] mb-4">
                Nenhum produto adicionado recentemente.
              </p>
              <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
                <Link href="/dashboard/products/new">
                  Adicione o primeiro produto
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
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
        </section>
      </main>
    </div>
  );
}
