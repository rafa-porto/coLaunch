"use client";

import {
  Banana,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  PlusCircle,
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
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/products",
      label: "Explore",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      href: "/submit-product",
      label: "Submit",
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-background/95 border-b border-border/60 shadow-md py-2"
          : "backdrop-blur-sm bg-background/30 py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-foreground group"
            >
              <div className="relative">
                <div
                  className={cn(
                    "absolute -inset-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500",
                    scrolled ? "scale-75" : "scale-100"
                  )}
                ></div>
                <Banana
                  className={cn(
                    "relative transition-all duration-300",
                    scrolled ? "h-6 w-6 text-primary" : "h-7 w-7 text-primary"
                  )}
                />
              </div>
              <span
                className={cn(
                  "font-bold transition-all duration-300",
                  scrolled ? "text-lg text-primary" : "text-xl text-primary"
                )}
              >
                co
                <span className="font-extralight text-muted-foreground transition-all duration-300">
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
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
                  pathname === link.href ||
                    (link.href.includes("?") &&
                      pathname === link.href.split("?")[0])
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell - hidden for now */}
            {/* <button className="hidden md:flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 hover:bg-muted transition-colors relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
            </button> */}

            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-muted/50 animate-pulse" />
            ) : session ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 hover:bg-primary/5 cursor-pointer bg-card/80 backdrop-blur-sm border border-border/60 rounded-lg focus:outline-none transition-all duration-200 hover:text-foreground hover:shadow-md">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                      <Image
                        src={
                          session?.user?.image ||
                          `https://github.com/shadcn.png`
                        }
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                      {session?.user?.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card/95 backdrop-blur-sm border border-border/60 text-card-foreground animate-in fade-in-50 slide-in-from-top-5 duration-200 shadow-lg rounded-lg"
                  >
                    <DropdownMenuLabel className="font-medium">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem className="hover:bg-primary/5 cursor-pointer hover:text-foreground transition-colors">
                      <Link
                        href="/profile"
                        className="flex w-full items-center"
                      >
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-primary/5 cursor-pointer hover:text-foreground transition-colors">
                      <Link
                        href="/profile/edit"
                        className="flex w-full items-center"
                      >
                        <Settings className="h-4 w-4 mr-2 text-primary" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
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
                      "bg-card/80 backdrop-blur-sm text-foreground border-border/60 hover:bg-primary/5 hover:text-foreground hidden sm:inline-flex transition-all duration-200 shadow-sm hover:shadow-md",
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
              className="md:hidden ml-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
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
          <div className="md:hidden py-3 px-2 space-y-1 border-t border-border/60 mt-2 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="flex justify-center py-2">
              <ModeToggle />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center",
                  pathname === link.href ||
                    (link.href.includes("?") &&
                      pathname === link.href.split("?")[0])
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
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
