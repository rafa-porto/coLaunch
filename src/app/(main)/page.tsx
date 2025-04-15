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
    <div className="min-h-screen bg-background text-foreground">
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
        <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Hero Section */}
      <main className="relative max-w-6xl mx-auto px-6 pt-[100px]">
        <div className="space-y-8 text-center">
          <h1 className="font-bold text-5xl md:text-6xl tracking-[-0.02em] leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-primary via-muted-foreground to-accent-foreground">
            coLaunch
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Discover, share and vote on the best digital products created by
            developers and makers.
          </p>

          <div className="flex justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/products">Explore Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted"
            >
              <Link href="/submit-product">Send Product</Link>
            </Button>
          </div>
        </div>

        {/* Featured Products */}
        <section className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured</h2>
            <Link
              href="/products?featured=true"
              className="text-primary hover:underline"
            >
              See all
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No products featured at the moment.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/submit-product">
                  Be the first to send a product
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-card border-border overflow-hidden hover:border-primary transition-all"
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
                    <CardTitle className="text-card-foreground">
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
                      <span className="text-sm text-muted-foreground">
                        {product.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
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
            <h2 className="text-2xl font-bold">Recent</h2>
            <Link href="/products" className="text-primary hover:underline">
              See all
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No products added recently.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/submit-product">Add your first product</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-card border-border overflow-hidden hover:border-primary transition-all"
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
                    <CardTitle className="text-card-foreground">
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
                      <span className="text-sm text-muted-foreground">
                        {product.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
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
