"use client";

import { Banana } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/95 border-b border-border shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Banana className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">
              co
              <span className="font-extralight text-muted-foreground">
                Launch
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ModeToggle />
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1 hover:bg-muted cursor-pointer bg-background border border-border rounded-lg focus:outline-none transition-colors hover:text-foreground">
                    <Image
                      src={
                        session?.user?.image || `https://github.com/shadcn.png`
                      }
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                      {session?.user?.name || "Usuário"}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card border border-border text-card-foreground"
                  >
                    <DropdownMenuLabel className="font-medium">
                      Minha Conta
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="hover:bg-muted cursor-pointer hover:text-foreground">
                      <Link href="/dashboard/profile" className="flex w-full">
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-muted cursor-pointer hover:text-foreground">
                      <Link href="/dashboard/settings" className="flex w-full">
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive cursor-pointer hover:bg-muted hover:text-destructive"
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "bg-background text-foreground border-border hover:bg-muted hover:text-foreground",
                  })}
                >
                  Entrar
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className:
                      "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
                  })}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
