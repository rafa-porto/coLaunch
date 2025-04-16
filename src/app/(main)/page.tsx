import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductHuntStyleCard } from "@/components/products/ProductHuntStyleCard";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Sparkles,
  Search,
  PlusCircle,
  ArrowDown,
  Package,
  Banana,
  Calendar,
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

export default function Home() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const todayProducts: Product[] = [];
  const yesterdayProducts: Product[] = [];

  // Formatar a data atual
  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Formatar a data de ontem
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = yesterday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-screen bg-background text-foreground overflow-y-auto">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes e formas */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent opacity-70"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>

        {/* Padrão de pontos */}
        <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="inline-block h-4 w-4 mr-1" />
              Discover amazing products
            </div>

            <h1 className="font-bold text-5xl md:text-7xl tracking-[-0.02em] leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                coLaunch
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mt-6">
              Discover, share and vote on the best digital products created by
              developers and makers around the world.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 gap-2 text-base"
              >
                <Link href="/products">
                  <Search className="h-5 w-5" />
                  Explore Products
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/60 text-foreground hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300 gap-2 text-base"
              >
                <Link href="/submit-product">
                  <PlusCircle className="h-5 w-5" />
                  Submit Product
                </Link>
              </Button>
            </div>

            <div className="pt-12 animate-bounce">
              <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />
            </div>
          </div>
        </section>

        {/* Products Feed - Product Hunt Style */}
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Discover</h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-border/60 text-foreground hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300 gap-2"
              >
                <Link href="/products">
                  View All Products
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Today's Products */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {formattedToday}
                </h3>
              </div>

              {todayProducts.length === 0 ? (
                <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8 text-center shadow-md">
                  <div className="bg-primary/10 p-4 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-primary/70" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No products launched today
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Be the first to share your product with our community today!
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
                <div className="space-y-4">
                  {todayProducts.map((product, index) => (
                    <ProductHuntStyleCard
                      key={product.id}
                      product={product}
                      index={index}
                      featured={index === 0}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Yesterday's Products */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {formattedYesterday}
                </h3>
              </div>

              {yesterdayProducts.length === 0 ? (
                <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl p-8 text-center shadow-md">
                  <div className="bg-primary/10 p-4 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-primary/70" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No products launched yesterday
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Check back tomorrow for new products or submit your own!
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/60 text-foreground hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300 gap-2"
                  >
                    <Link href="/products">
                      <Search className="h-4 w-4" />
                      Browse All Products
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {yesterdayProducts.map((product, index) => (
                    <ProductHuntStyleCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/60">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Banana className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-primary">
                  co
                  <span className="font-extralight text-muted-foreground">
                    Launch
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="hover:text-foreground transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/submit-product"
                  className="hover:text-foreground transition-colors"
                >
                  Submit
                </Link>
                <Link
                  href="/profile"
                  className="hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} coLaunch. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
