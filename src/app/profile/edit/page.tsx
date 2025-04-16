import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog, User } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileFallback } from "@/components/profile/ProfileFallback";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/db/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-background pb-16">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent opacity-70"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300 shadow-sm"
                asChild
              >
                <Link href="/profile">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Profile
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground hidden sm:block">
                Edit Profile
              </h1>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Update your profile details and social links
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>All changes will be visible on your public profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
