"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden bg-background border border-border hover:border-primary/30 hover:bg-muted hover:text-foreground transition-all duration-300 hover:shadow-md group rounded-md"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 dark:to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_40%)]"></span>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 text-amber-500 dark:-rotate-90 dark:scale-0 group-hover:text-amber-400" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:text-blue-400 dark:group-hover:text-blue-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="animate-in fade-in-50 slide-in-from-top-5 duration-200 w-40 p-2 border border-border bg-card/95 backdrop-blur-sm shadow-lg rounded-lg"
      >
        <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-1 border-b border-border/50 pb-1.5">
          Change theme
        </div>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 my-0.5 rounded-md",
            theme === "light"
              ? "bg-muted font-medium"
              : "hover:bg-muted/50 hover:pl-3"
          )}
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Light</span>
          </div>
          {mounted && theme === "light" && (
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 my-0.5 rounded-md",
            theme === "dark"
              ? "bg-muted font-medium"
              : "hover:bg-muted/50 hover:pl-3"
          )}
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-400" />
            <span>Dark</span>
          </div>
          {mounted && theme === "dark" && (
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 my-0.5 rounded-md",
            theme === "system"
              ? "bg-muted font-medium"
              : "hover:bg-muted/50 hover:pl-3"
          )}
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-muted-foreground" />
            <span>System</span>
          </div>
          {mounted && theme === "system" && (
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
