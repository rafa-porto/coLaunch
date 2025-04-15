import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepProductForm } from "@/components/products/MultiStepProductForm";
import { SubmitProductHeader } from "@/components/products/SubmitProductHeader";
import { auth } from "@/lib/auth";
import { getAllCategories } from "@/db/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SubmitProductPage() {
  // Verificar autenticação
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Buscar categorias
  const categories = await getAllCategories();

  // Log para depuração
  console.log(
    `Loaded ${categories.length} categories:`,
    categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
  );

  return (
    <>
      <SubmitProductHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Tips for a good submission
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Choose a clear and descriptive title</li>
                <li>
                  Add an attractive tagline that explains your product in one
                  sentence
                </li>
                <li>Provide a detailed description with the main features</li>
                <li>Add relevant tags to help with discovery</li>
                <li>Include a high-quality image to showcase your product</li>
              </ul>
            </div>
          </div>

          <MultiStepProductForm categories={categories} />
        </div>
      </div>
    </>
  );
}
