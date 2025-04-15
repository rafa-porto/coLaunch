import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  GithubIcon,
  Globe,
  TwitterIcon,
  LinkedinIcon,
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

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Hero section com informações do usuário */}
      <div className="w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar e informações básicas */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-background shadow-lg">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-foreground text-4xl">
                    {user?.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Informações do usuário */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user?.name}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div className="md:ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>

              {user?.bio && (
                <p className="text-foreground mb-6 max-w-2xl">{user.bio}</p>
              )}

              {/* Links sociais */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {user?.website && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground"
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
                    className="gap-2 border-border text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}

                {user?.twitter && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={`https://twitter.com/${user.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon className="h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                )}

                {user?.linkedin && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={`https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon className="h-4 w-4" />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Produtos</p>
                <p className="text-2xl font-bold text-foreground">
                  {userProducts.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Upvotes</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalUpvotes}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Comentários</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalComments}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ClientOnly>
          <Tabs defaultValue="products" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="products" className="text-muted-foreground">
                  Products
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-muted-foreground">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="about" className="text-muted-foreground">
                  About
                </TabsTrigger>
              </TabsList>

              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/submit-product">New Product</Link>
              </Button>
            </div>

            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-card border border-border rounded-lg">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't sent any products yet.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/submit-product">
                        Send your first product
                      </Link>
                    </Button>
                  </div>
                ) : (
                  userProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-md"
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
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Recent actions and interactions from the user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="bg-primary/10 p-4 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
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

            <TabsContent value="about" className="space-y-6">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle>Sobre {user?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Bio
                    </h3>
                    <p className="text-muted-foreground">
                      {user?.bio || "Nenhuma bio disponível."}
                    </p>
                  </div>

                  <Separator className="bg-border" />

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Info
                    </h3>
                    <dl className="space-y-2">
                      <div className="flex flex-col sm:flex-row">
                        <dt className="text-muted-foreground w-32">
                          Member Since
                        </dt>
                        <dd className="text-foreground">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "pt-BR"
                              )
                            : ""}
                        </dd>
                      </div>
                      {user?.website && (
                        <div className="flex flex-col sm:flex-row">
                          <dt className="text-muted-foreground w-32">
                            Website
                          </dt>
                          <dd className="text-foreground">
                            <a
                              href={user.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {user.website}
                            </a>
                          </dd>
                        </div>
                      )}
                      {user?.github && (
                        <div className="flex flex-col sm:flex-row">
                          <dt className="text-muted-foreground w-32">GitHub</dt>
                          <dd className="text-foreground">
                            <a
                              href={`https://github.com/${user.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              @{user.github}
                            </a>
                          </dd>
                        </div>
                      )}
                      {user?.twitter && (
                        <div className="flex flex-col sm:flex-row">
                          <dt className="text-muted-foreground w-32">
                            Twitter
                          </dt>
                          <dd className="text-foreground">
                            <a
                              href={`https://twitter.com/${user.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              @{user.twitter}
                            </a>
                          </dd>
                        </div>
                      )}
                      {user?.linkedin && (
                        <div className="flex flex-col sm:flex-row">
                          <dt className="text-muted-foreground w-32">
                            LinkedIn
                          </dt>
                          <dd className="text-foreground">
                            <a
                              href={`https://linkedin.com/in/${user.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {user.linkedin}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ClientOnly>
      </div>
    </div>
  );
}
