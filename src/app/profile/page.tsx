import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { getUserProfile, getUserProducts } from "@/db/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ProfileFallback } from "@/components/profile/ProfileFallback";
import ClientOnly from "@/components/ClientOnly";
import {
  Edit,
  Github,
  Globe,
  Twitter,
  Linkedin,
  Package,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user?.id;

  if (!userId) {
    return <ProfileFallback />;
  }

  const user = await getUserProfile(userId);

  if (!user) {
    return <ProfileFallback />;
  }

  const userProducts = (await getUserProducts(userId)) || [];

  // Estatísticas do usuário
  const totalUpvotes = userProducts.reduce(
    (sum, product) => sum + product.upvoteCount,
    0
  );
  const totalComments = userProducts.reduce(
    (sum, product) => sum + product.commentCount,
    0
  );

  // Calcular a data de registro formatada
  const joinDate = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent opacity-70"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Header do perfil */}
      <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 bg-card/80 backdrop-blur-sm border border-border rounded-xl p-8 shadow-lg">
            {/* Avatar e botão de edição */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-background shadow-xl">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-foreground text-5xl font-bold">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                asChild
              >
                <Link href="/profile/edit">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            {/* Informações do usuário */}
            <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    {user?.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Member since {joinDate}
                    </span>
                    <span>{user?.email}</span>
                  </p>
                </div>
              </div>

              {user?.bio ? (
                <div className="bg-muted/30 rounded-lg p-4 mb-6 max-w-3xl border border-border/50">
                  <p className="text-foreground italic">
                    &ldquo;{user.bio}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-4 mb-6 max-w-3xl border border-border/50 text-muted-foreground italic">
                  No bio provided
                </div>
              )}

              {/* Links sociais */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {user?.website && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                  >
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}

                {user?.github && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                  >
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}

                {user?.twitter && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                  >
                    <a
                      href={`https://twitter.com/${user.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                )}

                {user?.linkedin && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                  >
                    <a
                      href={`https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do usuário */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Products
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {userProducts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Upvotes
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {totalUpvotes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Comments
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {totalComments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ClientOnly>
            <Tabs defaultValue="products" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <TabsList className="bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md">
                  <TabsTrigger
                    value="products"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    Products
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    About
                  </TabsTrigger>
                </TabsList>

                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 gap-2"
                >
                  <Link href="/submit-product">
                    <Package className="h-4 w-4" />
                    New Product
                  </Link>
                </Button>
              </div>

              <TabsContent
                value="products"
                className="space-y-6 focus:outline-none"
              >
                {userProducts.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-md">
                    <div className="bg-primary/10 p-6 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                      <Package className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-3">
                      No products yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      You haven&apos;t submitted any products yet. Share your
                      creations with the community!
                    </p>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 gap-2"
                      size="lg"
                    >
                      <Link href="/submit-product">
                        <Package className="h-4 w-4" />
                        Submit Your First Product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-foreground">
                        Your Products{" "}
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({userProducts.length})
                        </span>
                      </h2>
                      <div className="flex items-center gap-2">
                        {/* Aqui poderia ter filtros ou ordenação */}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="activity"
                className="space-y-6 focus:outline-none"
              >
                <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      Recent Activities
                    </CardTitle>
                    <CardDescription>
                      Your recent interactions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-center py-16">
                      <div className="bg-primary/10 p-6 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                        <Package className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium text-foreground mb-3">
                        No recent activities
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        When you interact with products, receive upvotes, or
                        comments, your activities will appear here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="about"
                className="space-y-6 focus:outline-none"
              >
                <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <Edit className="h-4 w-4 text-primary" />
                      </div>
                      About {user?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Bio
                        </span>
                      </h3>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <p className="text-foreground">
                          {user?.bio ? (
                            <span className="italic">
                              &ldquo;{user.bio}&rdquo;
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              No bio provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Profile Info
                        </span>
                      </h3>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <dl className="space-y-4 divide-y divide-border/30">
                          <div className="flex flex-col sm:flex-row pt-2 first:pt-0">
                            <dt className="text-muted-foreground font-medium w-32 mb-1 sm:mb-0">
                              Member Since
                            </dt>
                            <dd className="text-foreground flex items-center">
                              {joinDate}
                            </dd>
                          </div>

                          {user?.website && (
                            <div className="flex flex-col sm:flex-row pt-4">
                              <dt className="text-muted-foreground font-medium w-32 mb-1 sm:mb-0">
                                Website
                              </dt>
                              <dd className="text-foreground">
                                <a
                                  href={user.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {user.website}
                                  <Globe className="h-3 w-3 inline" />
                                </a>
                              </dd>
                            </div>
                          )}

                          {user?.github && (
                            <div className="flex flex-col sm:flex-row pt-4">
                              <dt className="text-muted-foreground font-medium w-32 mb-1 sm:mb-0">
                                GitHub
                              </dt>
                              <dd className="text-foreground">
                                <a
                                  href={`https://github.com/${user.github}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  @{user.github}
                                  <Github className="h-3 w-3 inline" />
                                </a>
                              </dd>
                            </div>
                          )}

                          {user?.twitter && (
                            <div className="flex flex-col sm:flex-row pt-4">
                              <dt className="text-muted-foreground font-medium w-32 mb-1 sm:mb-0">
                                Twitter
                              </dt>
                              <dd className="text-foreground">
                                <a
                                  href={`https://twitter.com/${user.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  @{user.twitter}
                                  <Twitter className="h-3 w-3 inline" />
                                </a>
                              </dd>
                            </div>
                          )}

                          {user?.linkedin && (
                            <div className="flex flex-col sm:flex-row pt-4">
                              <dt className="text-muted-foreground font-medium w-32 mb-1 sm:mb-0">
                                LinkedIn
                              </dt>
                              <dd className="text-foreground">
                                <a
                                  href={`https://linkedin.com/in/${user.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {user.linkedin}
                                  <Linkedin className="h-3 w-3 inline" />
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
