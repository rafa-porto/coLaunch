import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { auth } from "@/lib/auth";
// import { getAllCategories } from "@/db/utils";
// import { redirect } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  // Versão simplificada sem consultas ao banco de dados para evitar erros
  const categories = [];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Meus Produtos", href: "/dashboard/products" },
    { label: "Novo Produto", href: "/dashboard/products/new" },
  ];

  return (
    <div className="container mx-auto px-6 md:px-0 pb-8">
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="flex-1 p-0 pt-4">
        <Card className="bg-[#2A2A2A] border border-[#424242]">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0]">
              Novo Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
