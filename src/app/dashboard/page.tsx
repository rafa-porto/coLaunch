import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  Package,
  Settings,
  ThumbsUp,
  MessageSquare,
  Rocket,
  Plus,
  Users,
} from "lucide-react";
// import { auth } from "@/lib/auth";
// import { getUserProducts } from "@/db/utils";
// import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const userProducts = [];

  const breadcrumbItems = [{ label: "Dashboard", href: "/dashboard" }];

  return (
    <div className="container mx-auto px-6 md:px-0 pb-8 ">
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="flex-1 p-0 md:p-6 pt-0">
        <Tabs defaultValue="overview">
          <div className="flex items-center justify-between">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="overview" className="text-muted-foreground">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="products" className="text-muted-foreground">
                Meus Produtos
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-muted-foreground">
                Atividade
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Meus Produtos
                  </CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {userProducts.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Produtos enviados
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Upvotes
                  </CardTitle>
                  <ThumbsUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {userProducts.reduce(
                      (total, product) => total + (product.upvoteCount || 0),
                      0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recebidos em seus produtos
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Comentários
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {userProducts.reduce(
                      (total, product) => total + (product.commentCount || 0),
                      0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recebidos em seus produtos
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status
                  </CardTitle>
                  <Rocket className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {userProducts.filter((p) => p.status === "approved").length}{" "}
                    / {userProducts.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Produtos aprovados
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="bg-card lg:col-span-4 border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Recent Sales
                  </CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-card-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card lg:col-span-3 border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Recent Orders
                  </CardTitle>
                  <CardDescription>
                    You received 30 orders this month.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-card-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-background border border-border text-muted-foreground hover:bg-background/90 hover:border-border hover:text-muted-foreground cursor-pointer"
                  >
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="bg-card lg:col-span-4 border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="font-medium text-muted-foreground">
                      Performance Overview
                    </CardTitle>
                    <CardDescription>
                      Monthly revenue and user growth
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background border border-border text-muted-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Last 30 days
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border border-dashed border-border bg-background flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Performance chart visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card lg:col-span-3 border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Recent Notifications
                  </CardTitle>
                  <CardDescription>
                    Stay updated with the latest alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Users,
                        color: "text-blue-500",
                        bg: "bg-blue-100",
                        title: "New team member joined",
                        time: "2 hours ago",
                      },
                      {
                        icon: CreditCard,
                        color: "text-green-500",
                        bg: "bg-green-100",
                        title: "Subscription payment successful",
                        time: "5 hours ago",
                      },
                      {
                        icon: ShoppingCart,
                        color: "text-yellow-500",
                        bg: "bg-yellow-100",
                        title: "New order received",
                        time: "1 day ago",
                      },
                      {
                        icon: Package,
                        color: "text-red-500",
                        bg: "bg-red-100",
                        title: "Product out of stock",
                        time: "2 days ago",
                      },
                    ].map((notification, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${notification.bg}`}
                        >
                          <notification.icon
                            className={`h-4 w-4 ${notification.color}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-card-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Frequently used tools and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Users, label: "Add User" },
                      { icon: Package, label: "New Product" },
                      { icon: CreditCard, label: "Billing" },
                      { icon: Settings, label: "Settings" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-20 flex-col bg-background border border-border text-muted-foreground hover:bg-background/90 hover:border-border hover:text-muted-foreground cursor-pointer"
                      >
                        <action.icon className="mb-2 h-5 w-5" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>
                    Your scheduled tasks for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Team meeting",
                        time: "10:00 AM",
                        completed: false,
                      },
                      {
                        title: "Project review",
                        time: "1:30 PM",
                        completed: false,
                      },
                      {
                        title: "Client call",
                        time: "3:00 PM",
                        completed: false,
                      },
                      {
                        title: "Update documentation",
                        time: "4:30 PM",
                        completed: true,
                      },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`h-5 w-5 rounded-full border ${task.completed ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                        >
                          {task.completed && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="font-medium text-muted-foreground">
                    Team Activity
                  </CardTitle>
                  <CardDescription>
                    Recent actions from your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        user: "Alex",
                        action: "created a new project",
                        time: "Just now",
                      },
                      {
                        user: "Sarah",
                        action: "completed 3 tasks",
                        time: "1 hour ago",
                      },
                      {
                        user: "Michael",
                        action: "uploaded new files",
                        time: "3 hours ago",
                      },
                      {
                        user: "Jessica",
                        action: "invited 2 new members",
                        time: "Yesterday",
                      },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium text-card-foreground">
                              {activity.user}
                            </span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="products" className="space-y-4 pt-4">
            <Card className="bg-card border border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-medium text-muted-foreground">
                    Meus Produtos
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus produtos enviados
                  </CardDescription>
                </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProducts.slice(0, 4).map((product) => (
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
                            <span>⬆️ {product.upvoteCount || 0}</span>
                            <span>💬 {product.commentCount || 0}</span>
                          </div>
                          <div>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-border text-muted-foreground"
                            >
                              <Link
                                href={`/dashboard/products/${product.id}/edit`}
                              >
                                Editar
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {userProducts.length > 4 && (
                  <div className="mt-4 text-center">
                    <Button
                      asChild
                      variant="outline"
                      className="border-border text-muted-foreground"
                    >
                      <Link href="/dashboard/products">
                        Ver todos os produtos
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4 pt-4">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="font-medium text-muted-foreground">
                  Atividade Recente
                </CardTitle>
                <CardDescription>
                  Acompanhe as interações com seus produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProducts.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Nenhuma atividade recente. Envie seu primeiro produto para
                      começar!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <ThumbsUp className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-muted-foreground">
                            Seu produto recebeu um novo upvote
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Há 2 dias
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-muted-foreground">
                            Novo comentário em seu produto
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Há 3 dias
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <Rocket className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-muted-foreground">
                            Seu produto foi aprovado
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Há 1 semana
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
