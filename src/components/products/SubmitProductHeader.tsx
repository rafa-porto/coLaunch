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

  // Get the current step icon
  const getStepIcon = () => {
    switch (currentStep) {
      case 1:
        return "✏️";
      case 2:
        return "📝";
      case 3:
        return "🔗";
      case 4:
        return "🏷️";
      default:
        return "📦";
    }
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              Submit Product
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                New
              </span>
            </h1>
            <div className="flex items-center mt-1">
              <span className="mr-2 text-lg" aria-hidden="true">
                {getStepIcon()}
              </span>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">
                  {getStepTitle()}
                </span>{" "}
                <span className="hidden sm:inline">
                  - Step {currentStep} of {totalSteps}
                </span>
              </p>
            </div>
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
