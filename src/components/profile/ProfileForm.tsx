"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, UserProfileFormData } from "@/db/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Globe,
  Github,
  Twitter,
  Linkedin,
  Save,
  User as UserIcon,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
  user: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: user?.name || "",
    bio: user?.bio || "",
    website: user?.website || "",
    twitter: user?.twitter || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific error message if available
        const errorMessage = data.error || "Failed to update profile";
        toast.error(errorMessage);
        return;
      }

      toast.success("Profile updated successfully!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      // Show detailed error message
      const errorMessage =
        error instanceof Error ? error.message : "Error updating profile";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção de informações básicas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Basic Information
          </h3>
        </div>

        <div className="bg-muted/30 rounded-lg p-5 border border-border/50 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="text-foreground font-medium flex items-center gap-1"
            >
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-background/50 border-border/60 text-foreground mt-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
              required
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label
              htmlFor="bio"
              className="text-foreground font-medium flex items-center gap-1"
            >
              <span>Bio</span>
              <span className="text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              className="bg-background/50 border-border/60 text-foreground mt-1.5 min-h-[120px] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
              placeholder="Tell us a bit about yourself..."
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              This will be displayed on your public profile
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Seção de links sociais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Social Links</h3>
        </div>

        <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label
                htmlFor="website"
                className="text-foreground font-medium flex items-center gap-2"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="bg-background/50 border-border/60 text-foreground mt-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label
                htmlFor="github"
                className="text-foreground font-medium flex items-center gap-2"
              >
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                GitHub
              </Label>
              <Input
                id="github"
                name="github"
                value={formData.github || ""}
                onChange={handleChange}
                className="bg-background/50 border-border/60 text-foreground mt-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                placeholder="username"
              />
            </div>

            <div>
              <Label
                htmlFor="twitter"
                className="text-foreground font-medium flex items-center gap-2"
              >
                <Twitter className="h-3.5 w-3.5 text-muted-foreground" />
                Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.twitter || ""}
                onChange={handleChange}
                className="bg-background/50 border-border/60 text-foreground mt-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                placeholder="username"
              />
            </div>

            <div>
              <Label
                htmlFor="linkedin"
                className="text-foreground font-medium flex items-center gap-2"
              >
                <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleChange}
                className="bg-background/50 border-border/60 text-foreground mt-1.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                placeholder="username"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            These links will be displayed on your profile and product pages
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
