"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Category, ProductFormData } from "@/db/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Link as LinkIcon,
  Tag,
  Image as ImageIcon,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SuccessMessage } from "./SuccessMessage";
import { useFormStep } from "@/hooks/useFormStep";
import { CategorySelector } from "./CategorySelector";

interface MultiStepProductFormProps {
  categories: Category[];
  product?: any; // Existing product for editing
  isEdit?: boolean;
}

export function MultiStepProductForm({
  categories,
  product,
  isEdit = false,
}: MultiStepProductFormProps) {
  // Use the form step hook for step management
  const {
    currentStep,
    totalSteps,
    nextStep: goToNextStep,
    prevStep: goToPrevStep,
    setCurrentStep,
  } = useFormStep();

  // Reset step when component unmounts
  useEffect(() => {
    return () => {
      setCurrentStep(1);
    };
  }, [setCurrentStep]);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || "",
    tagline: product?.tagline || "",
    description: product?.description || "",
    websiteUrl: product?.websiteUrl || "",
    githubUrl: product?.githubUrl || "",
    categoryId: product?.categoryId || undefined,
    tags: product?.tags?.map((tag: any) => tag.name) || [],
    thumbnail: product?.thumbnail || "",
    images: product?.images || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState<{
    title: string;
    slug?: string;
  }>({ title: "" });

  // Função para executar o seed de categorias
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
        // Recarregar a página para mostrar as novas categorias
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
  const router = useRouter();

  // Function to check if the current step is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: // Basic information
        return !!formData.title.trim() && !!formData.tagline.trim();
      case 2: // Description
        return !!formData.description.trim();
      case 3: // Category & Links
        return !!formData.categoryId; // Category is required
      case 4: // Tags and images
        return true; // Optional
      default:
        return false;
    }
  };

  // Function to advance to the next step
  const nextStep = () => {
    if (isStepComplete(currentStep)) {
      goToNextStep();
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  // Function to go back to the previous step
  const prevStep = () => {
    goToPrevStep();
    window.scrollTo(0, 0);
  };

  // Event handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Function to submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.tagline.trim() ||
      !formData.description.trim() ||
      !formData.categoryId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      // Generate slug from title
      const slug = slugify(formData.title);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      // Get product data from response
      const productData = await response.json();

      toast.success(
        isEdit
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      // Set success state and product data
      setSubmittedProduct({
        title: formData.title,
        slug: productData?.slug || slug,
      });
      setIsSuccess(true);

      // We don't redirect immediately to show the success message
      // router.push("/profile");
      // router.refresh();
    } catch (error) {
      toast.error(isEdit ? "Error updating product" : "Error creating product");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2 relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10" />
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted =
            isStepComplete(stepNumber) && stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2 transition-all duration-300
                  ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : isCompleted
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-background border-muted text-muted-foreground"
                  }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span className="text-xs hidden sm:block font-medium">
                {stepNumber === 1 && "Basic"}
                {stepNumber === 2 && "Description"}
                {stepNumber === 3 && "Links"}
                {stepNumber === 4 && "Finalize"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-4">
        <div
          className="bg-primary h-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  // Conditional rendering of steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Basic Information</h2>
            </div>

            <div>
              <Label htmlFor="title" className="text-foreground">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
                placeholder="Name of your product"
                required
              />
            </div>

            <div>
              <Label htmlFor="tagline" className="text-foreground">
                Tagline *
              </Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
                placeholder="A short phrase that describes your product"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                A short and attractive description of your product (max. 100
                characters)
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Detailed Description</h2>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-background border-border text-foreground min-h-[250px]"
                placeholder="Describe your product in detail. Explain what it does, what problems it solves, and why people should use it."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Be clear and concise. Highlight the main features and
                benefits.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Category & Links</h2>
            </div>

            <div>
              <Label
                htmlFor="categoryId"
                className="text-foreground mb-2 block"
              >
                Category *
              </Label>
              <div className="relative">
                <CategorySelector
                  categories={categories}
                  selectedCategoryId={
                    formData.categoryId
                      ? Number(formData.categoryId)
                      : undefined
                  }
                  onChange={(categoryId) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: categoryId,
                    }));
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Choose the category that best fits your product
                </p>
                {categories.length === 0 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={seedCategories}
                    disabled={isSeeding}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSeeding ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Add Categories
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                Product Links{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="websiteUrl" className="text-foreground">
                    Website
                  </Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="bg-background border-border text-foreground"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="githubUrl" className="text-foreground">
                    GitHub
                  </Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="bg-background border-border text-foreground"
                    placeholder="https://github.com/your-username/repository"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Tags and Images</h2>
            </div>

            <div>
              <Label htmlFor="tags" className="text-foreground">
                Tags
              </Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="bg-background border-border text-foreground flex-1"
                  placeholder="Add tags for your product"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-border text-muted-foreground"
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Add relevant tags to help people find your product
              </p>
            </div>

            <div>
              <Label htmlFor="thumbnail" className="text-foreground">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="bg-background border-border text-foreground"
                placeholder="URL of the main image"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Use services like Imgur or Cloudinary to host your images
              </p>
            </div>

            {formData.thumbnail && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="relative h-48 w-full max-w-md border border-border rounded-md overflow-hidden">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Product Summary
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Title:</strong> {formData.title}
                </p>
                <p>
                  <strong>Tagline:</strong> {formData.tagline}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {categories.find((c) => c.id === Number(formData.categoryId))
                    ?.name || "None"}
                </p>
                <p>
                  <strong>Tags:</strong>{" "}
                  {formData.tags.length > 0 ? formData.tags.join(", ") : "None"}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If the product was successfully submitted, show the success message
  if (isSuccess) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="pt-6">
          <SuccessMessage
            productTitle={submittedProduct.title}
            productSlug={submittedProduct.slug}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProgressBar />

      <div className="relative overflow-hidden">
        <Card className="bg-card border border-border">
          <CardContent className="pt-6">
            <div className="transition-all duration-300 ease-in-out">
              {renderStep()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-border text-muted-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepComplete(currentStep)}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting
              ? "Submitting..."
              : isEdit
                ? "Update Product"
                : "Create Product"}
          </Button>
        )}
      </div>
    </form>
  );
}
