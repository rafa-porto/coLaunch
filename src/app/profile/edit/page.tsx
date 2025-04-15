import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileFallback } from "@/components/profile/ProfileFallback";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/db/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function EditProfilePage() {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mr-4 gap-2 border-border text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao perfil
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Editar Perfil</h1>
      </div>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
