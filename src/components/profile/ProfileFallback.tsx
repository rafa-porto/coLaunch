import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package } from "lucide-react";

export function ProfileFallback() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Perfil não encontrado</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">
            Não foi possível carregar os dados do perfil. Isso pode acontecer se você não estiver autenticado ou se houver um problema com o banco de dados.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">Voltar para a página inicial</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
