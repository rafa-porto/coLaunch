import React from "react";
import { Search } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export const TopBar = ({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) => {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <header className="bg-background h-16 px-6 flex items-center justify-between border-b border-border sticky top-0 w-full z-10 shadow-sm">
      <div className="flex items-center flex-1 max-w-xl gap-4">
        <MobileSidebar
          isOpen={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <button
          className="p-1 hidden lg:block text-muted-foreground"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="relative flex-1 ml-4 lg:ml-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search anything here..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1 hover:bg-muted cursor-pointer bg-background border border-border rounded-lg focus:outline-none hover:text-foreground transition-colors">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : (
              <Image
                src={session?.user?.image || `https://github.com/shadcn.png`}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-foreground">
              {isPending ? "Loading..." : session?.user?.name || "Guest"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border border-border text-card-foreground"
          >
            <DropdownMenuLabel className="font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="hover:bg-muted hover:text-foreground cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted hover:text-foreground cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted hover:text-foreground cursor-pointer">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer hover:bg-muted hover:text-destructive"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
