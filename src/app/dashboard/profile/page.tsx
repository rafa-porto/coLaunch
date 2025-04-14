import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import { auth } from "@/lib/auth";
// import { getUserProfile, getUserProducts } from "@/db/utils";
// import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const user = null;
  const userProducts = [];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Perfil", href: "/dashboard/profile" },
  ];

  return (
    <div className="container mx-auto px-6 md:px-0 pb-8">
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="flex-1 p-0 pt-4 space-y-6">
        {/* Perfil do Usuário */}
        <Card className="bg-[#2A2A2A] border border-[#424242]">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0]">
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Informações básicas */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#424242] flex items-center justify-center text-white text-4xl">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {user?.name}
                </h2>
                <p className="text-[#7a7a7a] mb-4">{user?.email}</p>

                <div className="w-full space-y-2">
                  {user?.website && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#424242] text-[#7a7a7a]"
                    >
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </Button>
                  )}

                  {user?.github && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#424242] text-[#7a7a7a]"
                    >
                      <a
                        href={`https://github.com/${user.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </Button>
                  )}

                  {user?.twitter && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#424242] text-[#7a7a7a]"
                    >
                      <a
                        href={`https://twitter.com/${user.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </Button>
                  )}

                  {user?.linkedin && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#424242] text-[#7a7a7a]"
                    >
                      <a
                        href={`https://linkedin.com/in/${user.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Formulário de edição */}
              <div className="flex-1">
                <ProfileForm user={user} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos do Usuário */}
        <Card className="bg-[#2A2A2A] border border-[#424242]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#A0A0A0]">
              Meus Produtos
            </CardTitle>
            <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
              <Link href="/dashboard/products/new">Novo Produto</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {userProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#7a7a7a] mb-4">
                  Você ainda não enviou nenhum produto.
                </p>
                <Button asChild className="bg-[#b17f01] hover:bg-[#8a6401]">
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
                    className="bg-[#242424] border-[#424242] overflow-hidden hover:border-[#b17f01] transition-all"
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
                      <CardTitle className="text-white text-base">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-[#b17f01]"
                        >
                          {product.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[#7a7a7a]">
                        <span>⬆️ {product.upvoteCount}</span>
                        <span>💬 {product.commentCount}</span>
                      </div>
                      <div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-[#424242] text-[#7a7a7a]"
                        >
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            Editar
                          </Link>
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
