"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

interface SuccessMessageProps {
  productTitle: string;
  productSlug?: string;
}

export function SuccessMessage({
  productTitle,
  productSlug,
}: SuccessMessageProps) {
  const router = useRouter();

  return (
    <div className="text-center py-8 px-4">
      <div className="mb-6 flex justify-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Product submitted successfully!
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Your product{" "}
        <span className="font-medium text-foreground">"{productTitle}"</span>{" "}
        has been submitted and is awaiting approval.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/profile">
            View my products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-border text-muted-foreground"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to home page
          </Link>
        </Button>
      </div>
    </div>
  );
}
