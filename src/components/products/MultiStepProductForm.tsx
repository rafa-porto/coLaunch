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
  Calendar,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    publishedAt: product?.publishedAt
      ? new Date(product.publishedAt).toISOString().split("T")[0]
      : "",
  });

  // Definir a data mínima como amanhã (não pode ser o dia atual)
  const tomorrow = addDays(new Date(), 1);
  const [date, setDate] = useState<Date | undefined>(
    formData.publishedAt ? new Date(formData.publishedAt) : undefined
  );
  
  // Atualizar formData quando a data mudar
  useEffect(() => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        publishedAt: format(date, "yyyy-MM-dd"),
      }));
    }
  }, [date]);

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
        return !!formData.categoryId && !!formData.publishedAt; // Category and launch date are required
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

    // Ensure we're on the last step before submitting
    if (currentStep !== totalSteps) {
      // If not on the last step, just go to the next step
      nextStep();
      return;
    }

    // Validate all required fields before submission
    if (
      !formData.title.trim() ||
      !formData.tagline.trim() ||
      !formData.description.trim() ||
      !formData.categoryId ||
      !formData.publishedAt
    ) {
      toast.error("Please fill in all required fields");

      // Find which step has missing data and go to that step
      if (!formData.title.trim() || !formData.tagline.trim()) {
        setCurrentStep(1);
      } else if (!formData.description.trim()) {
        setCurrentStep(2);
      } else if (!formData.categoryId || !formData.publishedAt) {
        setCurrentStep(3);
      }

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
  const ProgressBar = () => {
    const stepLabels = ["Basic", "Description", "Links", "Finalize"];
    const stepIcons = ["✏️", "📝", "🔗", "🏷️"];

    return (
      <div className="mb-10">
        <div className="flex justify-between mb-4 relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-10" />

          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted =
              isStepComplete(stepNumber) && stepNumber <= currentStep;
            const isPast = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className={`flex flex-col items-center ${isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"}`}
                onClick={() => isPast && setCurrentStep(stepNumber)}
                style={{ cursor: isPast ? "pointer" : "default" }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-md scale-110"
                      : isCompleted
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-lg" aria-hidden="true">
                      {stepIcons[index]}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 ${isActive ? "scale-110" : ""}`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-6">
          <div
            className="bg-primary h-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Conditional rendering of steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Basic Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Let's start with the essentials about your product
                </p>
              </div>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="title"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Title <span className="text-primary">*</span>
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Required
                </span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-2 bg-background border-border text-foreground focus:border-primary/50 transition-all duration-300"
                placeholder="Name of your product"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Choose a clear, descriptive name that represents your product
                well
              </p>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="tagline"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Tagline <span className="text-primary">*</span>
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Required
                </span>
              </Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="mt-2 bg-background border-border text-foreground focus:border-primary/50 transition-all duration-300"
                placeholder="A short phrase that describes your product"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                A short and attractive description of your product (max. 100
                characters)
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Detailed Description
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tell us more about your product and what makes it special
                </p>
              </div>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="description"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Description <span className="text-primary">*</span>
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Required
                </span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-2 bg-background border-border text-foreground focus:border-primary/50 transition-all duration-300 min-h-[250px] resize-y"
                placeholder="Describe your product in detail. Explain what it does, what problems it solves, and why people should use it."
                required
              />
              <div className="mt-3 p-3 bg-muted/30 rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Writing Tips
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Be clear and concise about what your product does</li>
                  <li>Highlight the main features and benefits</li>
                  <li>Explain what problems your product solves</li>
                  <li>Mention your target audience</li>
                  <li>Include any unique selling points</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="bg-primary/10 p-2 rounded-full">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Category & Links
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Categorize your product and add relevant links
                </p>
              </div>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="categoryId"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Category <span className="text-primary">*</span>
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Required
                </span>
              </Label>
              <div className="relative mt-2">
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

            <div className="mt-6 p-4 bg-muted/20 rounded-lg -mx-4">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Launch Date{" "}
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Required
                </span>
              </h3>

              <div className="mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Schedule launch date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < tomorrow}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-2">
                  Schedule when your product will be launched. Must be a future
                  date (not today).
                </p>
              </div>

              <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-foreground">
                <LinkIcon className="h-4 w-4 text-primary" />
                Product Links{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (Optional)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <Label
                    htmlFor="websiteUrl"
                    className="text-foreground flex items-center gap-2"
                  >
                    Website URL
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground pl-10 focus:border-primary/50 transition-all duration-300"
                      placeholder="https://yourproduct.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <Label
                    htmlFor="githubUrl"
                    className="text-foreground flex items-center gap-2"
                  >
                    GitHub URL
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </Label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </div>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className="bg-background border-border text-foreground pl-10 focus:border-primary/50 transition-all duration-300"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="bg-primary/10 p-2 rounded-full">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Tags and Images
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add tags and an image to make your product stand out
                </p>
              </div>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="tags"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Tags
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-background border-border text-foreground pl-10 focus:border-primary/50 transition-all duration-300"
                    placeholder="Add tags for your product"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  Add Tag
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-full text-sm flex items-center gap-1.5 transition-all duration-300 hover:bg-primary/10"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary/70 hover:text-primary rounded-full hover:bg-primary/10 w-4 h-4 inline-flex items-center justify-center transition-all duration-300"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No tags added yet
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Add relevant tags to help people find your product (e.g.,
                "productivity", "design", "ai")
              </p>
            </div>

            <div className="group transition-all duration-300 hover:bg-muted/20 p-4 rounded-lg -mx-4">
              <Label
                htmlFor="thumbnail"
                className="text-foreground font-medium flex items-center gap-2"
              >
                Thumbnail URL
                <span className="ml-1 text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="bg-background border-border text-foreground pl-10 focus:border-primary/50 transition-all duration-300"
                  placeholder="URL of the main image for your product"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Tip: Use services like Imgur or Cloudinary to host your images
              </p>
            </div>

            {formData.thumbnail && (
              <div className="p-4 border border-border rounded-lg bg-card/50 mt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Image Preview
                </p>
                <div className="relative h-48 w-full max-w-md border border-border rounded-lg overflow-hidden shadow-sm">
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

            <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
                <ImageIcon className="h-4 w-4 text-primary" />
                Product Summary
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Title:
                  </span>
                  <span className="text-muted-foreground">
                    {formData.title || "Not provided"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Tagline:
                  </span>
                  <span className="text-muted-foreground">
                    {formData.tagline || "Not provided"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Category:
                  </span>
                  <span className="text-muted-foreground">
                    {categories.find(
                      (c) => c.id === Number(formData.categoryId)
                    )?.name || "None"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Tags:
                  </span>
                  <span className="text-muted-foreground">
                    {formData.tags.length > 0
                      ? formData.tags.join(", ")
                      : "None"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Website:
                  </span>
                  <span className="text-muted-foreground">
                    {formData.websiteUrl || "Not provided"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-foreground min-w-24">
                    Launch Date:
                  </span>
                  <span className="text-muted-foreground">
                    {formData.publishedAt
                      ? format(new Date(formData.publishedAt), "PPP")
                      : "Not scheduled"}
                  </span>
                </div>
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProgressBar />

      <div className="relative overflow-hidden">
        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="pt-8 px-6 sm:px-8">
            <div className="transition-all duration-300 ease-in-out">
              {renderStep()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-10 sticky bottom-4 z-10">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-border text-muted-foreground hover:bg-muted/50 transition-all duration-300 shadow-sm"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepComplete(currentStep)}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm"
            size="lg"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
