import { Banana } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const handleSignOut = async () => {
    "use server";
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#2A2A2A]/95 border-b border-[#424242] shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Banana className="h-6 w-6 text-[#b17f01]" />
            <span className="font-bold text-[#b17f01]">
              co<span className="font-extralight text-[#7A7A7A]">Launch</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1 hover:bg-[#424242] cursor-pointer bg-[#242424] border border-[#424242] rounded-lg focus:outline-none transition-colors">
                    <Image
                      src={
                        session?.user?.image || `https://github.com/shadcn.png`
                      }
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-[#7a7a7a] hidden sm:inline-block">
                      {session?.user?.name || "Usuário"}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#242424] border border-[#424242] text-[#7a7a7a]"
                  >
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#424242]" />
                    <DropdownMenuItem className="hover:bg-[#424242] cursor-pointer">
                      <Link href="/dashboard/profile" className="flex w-full">
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#424242] cursor-pointer">
                      <Link href="/dashboard/settings" className="flex w-full">
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#424242]" />
                    <form action={handleSignOut}>
                      <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-[#424242] hover:text-red-400">
                        Sair
                      </DropdownMenuItem>
                    </form>
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
                      "bg-[#242424] text-[#7a7a7a] border-[#424242] hover:bg-[#363636] hover:text-white",
                  })}
                >
                  Entrar
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className: "bg-[#b17f01] text-black hover:bg-[#d09601]",
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
