"use client";

import {
  Banana,
  Search,
  Package,
  Star,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const navLinks = [
    {
      href: "/products",
      label: "Explore",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      href: "/products?featured=true",
      label: "Featured",
      icon: <Star className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/products/new",
      label: "Submit Product",
      icon: <Package className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "backdrop-blur-md bg-background/95 border-b border-border shadow-md py-2"
          : "backdrop-blur-none bg-background/0 py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Banana
                className={cn(
                  "transition-all duration-200",
                  scrolled ? "h-6 w-6 text-primary" : "h-7 w-7 text-primary"
                )}
              />
              <span
                className={cn(
                  "font-bold transition-all duration-200",
                  scrolled ? "text-lg text-primary" : "text-xl text-primary"
                )}
              >
                co
                <span className="font-extralight text-muted-foreground transition-all duration-200">
                  Launch
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                  pathname === link.href ||
                    (link.href.includes("?") &&
                      pathname === link.href.split("?")[0])
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 hover:bg-muted cursor-pointer bg-background border border-border rounded-lg focus:outline-none transition-all duration-200 hover:text-foreground hover:shadow-sm">
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
                    className="w-56 bg-card border border-border text-card-foreground animate-in fade-in-50 slide-in-from-top-5 duration-200"
                  >
                    <DropdownMenuLabel className="font-medium">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="hover:bg-muted cursor-pointer hover:text-foreground">
                      <Link
                        href="/dashboard/profile"
                        className="flex w-full items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-muted cursor-pointer hover:text-foreground">
                      <Link
                        href="/dashboard/settings"
                        className="flex w-full items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive cursor-pointer hover:bg-muted hover:text-destructive"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "bg-background text-foreground border-border hover:bg-muted hover:text-foreground hidden sm:inline-flex transition-all duration-200",
                  })}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className:
                      "bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm hover:shadow-md transition-all duration-200",
                  })}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 px-2 space-y-1 border-t border-border mt-2 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="flex justify-center py-2">
              <ModeToggle />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center",
                  pathname === link.href ||
                    (link.href.includes("?") &&
                      pathname === link.href.split("?")[0])
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
