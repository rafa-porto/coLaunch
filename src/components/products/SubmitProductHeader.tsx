"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFormStep } from "@/hooks/useFormStep";

export function SubmitProductHeader() {
  const router = useRouter();
  const { currentStep, totalSteps } = useFormStep();

  // Get the current step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Product Description";
      case 3:
        return "Category & Links";
      case 4:
        return "Tags & Images";
      default:
        return "Submit Product";
    }
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Submit Product
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              <span className="text-primary font-medium">{getStepTitle()}</span>{" "}
              - Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border text-muted-foreground hover:bg-muted/50"
          >
            <Link href="/profile">Cancel</Link>
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
            {currentStep}/{totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
}
