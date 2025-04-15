"use client";

import { useState } from "react";
import { Category } from "@/db/types";
import { Check, ChevronDown, Search, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: number;
  onChange: (categoryId: number) => void;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  // Function to seed categories
  const seedCategories = async () => {
    try {
      setIsSeeding(true);

      const response = await fetch("/api/admin/seed-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reload the page to show the new categories
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to seed categories");
      }
    } catch (error) {
      console.error("Error seeding categories:", error);
      toast.error("An error occurred while seeding categories");
    } finally {
      setIsSeeding(false);
    }
  };

  // Ensure categories is a valid array
  const validCategories = Array.isArray(categories) ? categories : [];

  // Group categories by type based on their name
  const groupedCategories = validCategories.reduce(
    (acc, category) => {
      // Determine the group based on the category name
      let group = "Other";

      if (
        category.name.includes("Development") ||
        category.name.includes("DevOps") ||
        category.name.includes("API") ||
        category.name.includes("Database")
      ) {
        group = "Development";
      } else if (
        category.name.includes("Design") ||
        category.name.includes("Creative") ||
        category.name.includes("3D")
      ) {
        group = "Design & Creative";
      } else if (
        category.name.includes("Productivity") ||
        category.name.includes("Project") ||
        category.name.includes("Marketing") ||
        category.name.includes("Sales") ||
        category.name.includes("Finance")
      ) {
        group = "Business & Productivity";
      } else if (
        category.name.includes("AI") ||
        category.name.includes("Data")
      ) {
        group = "AI & Data";
      } else if (
        category.name.includes("Web") ||
        category.name.includes("Mobile") ||
        category.name.includes("E-commerce")
      ) {
        group = "Web & Mobile";
      } else if (
        category.name.includes("Security") ||
        category.name.includes("Privacy")
      ) {
        group = "Security & Compliance";
      } else if (
        category.name.includes("Communication") ||
        category.name.includes("Collaboration")
      ) {
        group = "Communication & Collaboration";
      } else if (category.name.includes("Education")) {
        group = "Education & Learning";
      } else if (
        category.name.includes("Gaming") ||
        category.name.includes("Health")
      ) {
        group = "Other";
      }

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(category);
      return acc;
    },
    {} as Record<string, Category[]>
  );

  // Order of groups to display
  const groupOrder = [
    "Development",
    "Web & Mobile",
    "Design & Creative",
    "AI & Data",
    "Business & Productivity",
    "Communication & Collaboration",
    "Security & Compliance",
    "Education & Learning",
    "Other",
  ];

  // Sort groups according to the defined order
  const sortedGroups = Object.keys(groupedCategories).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );

  // Get the selected category
  const selectedCategory = validCategories.find(
    (category) => category.id === selectedCategoryId
  );

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? validCategories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Trigger button */}
      <Button
        type="button"
        variant="outline"
        role="combobox"
        className={cn(
          "w-full justify-between bg-background border-border text-foreground h-10 px-3 py-2 transition-all duration-300",
          selectedCategory
            ? "border-primary/50 shadow-sm"
            : "text-muted-foreground"
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedCategory ? (
            <>
              <div className="bg-primary/10 p-1 rounded-full">
                <Layers className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="truncate">{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select a category</span>
          )}
        </div>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Category selection modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Select a Category
            </DialogTitle>
            <DialogDescription>
              Choose the category that best fits your product.
            </DialogDescription>
          </DialogHeader>

          {/* Search bar */}
          <div className="sticky top-0 z-10 bg-background py-3 border-b border-border">
            <div className="flex items-center border border-border rounded-md px-3 py-2 bg-muted/30 focus-within:border-primary/50 focus-within:bg-background transition-colors">
              <Search className="h-4 w-4 text-primary/70 mr-2 flex-shrink-0" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* Categories list */}
          <div className="overflow-y-auto flex-1 p-2">
            {validCategories.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                <div className="mb-2 text-primary/70">
                  No categories available
                </div>
                <div className="text-xs mb-4">
                  Click the button below to add categories
                </div>
                <Button
                  size="default"
                  onClick={seedCategories}
                  disabled={isSeeding}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-6"
                >
                  {isSeeding ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adding Categories...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Add Categories
                    </>
                  )}
                </Button>
              </div>
            ) : searchQuery ? (
              filteredCategories.length > 0 ? (
                <div className="space-y-1.5 p-2">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-all duration-200",
                        selectedCategoryId === category.id
                          ? "bg-primary/15 text-primary font-semibold shadow-sm border border-primary/20"
                          : "hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => {
                        onChange(category.id);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <Layers className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {category.name}
                      </div>
                      {selectedCategoryId === category.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                  No categories found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )
            ) : (
              <div className="p-2">
                {sortedGroups.map((group) => (
                  <div
                    key={group}
                    className="mb-5 last:mb-0 pb-2 border-b border-border last:border-0"
                  >
                    <div className="px-3 py-2 text-xs font-semibold text-primary/80 bg-muted/70 rounded-md mb-2 uppercase tracking-wider">
                      {group}
                    </div>
                    <div className="space-y-1.5">
                      {groupedCategories[group].map((category) => (
                        <button
                          key={category.id}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-all duration-200",
                            selectedCategoryId === category.id
                              ? "bg-primary/15 text-primary font-semibold shadow-sm border border-primary/20"
                              : "hover:bg-muted hover:text-foreground"
                          )}
                          onClick={() => {
                            onChange(category.id);
                            setIsOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1 rounded-full">
                              <Layers className="h-3.5 w-3.5 text-primary" />
                            </div>
                            {category.name}
                          </div>
                          {selectedCategoryId === category.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border pt-4 mt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
