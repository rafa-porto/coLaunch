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
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute top-0 left-0 w-[800px] h-[600px] opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl"></div>
          </div>
          {/* Subtle dots overlay */}
          <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 mb-8 flex items-start gap-4 shadow-sm">
              <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
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
                <h3 className="font-medium text-foreground mb-2 text-lg">
                  Tips for a successful submission
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Choose a clear and descriptive title that stands out
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Add an attractive tagline that explains your product in
                      one sentence
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Provide a detailed description highlighting the main
                      features and benefits
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Add relevant tags to help with discovery and
                      categorization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Include a high-quality image to showcase your product and
                      attract attention
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <MultiStepProductForm categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}
