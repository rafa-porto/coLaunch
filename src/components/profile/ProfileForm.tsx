"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, UserProfileFormData } from "@/db/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      toast.error("O nome é obrigatório");
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
        // Mostrar mensagem de erro específica se disponível
        const errorMessage = data.error || "Falha ao atualizar perfil";
        toast.error(errorMessage);
        return;
      }

      toast.success("Perfil atualizado com sucesso!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      // Mostrar mensagem de erro mais detalhada
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(errorMessage);
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-foreground">
          Nome
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-background border-border text-foreground"
          required
        />
      </div>

      <div>
        <Label htmlFor="bio" className="text-foreground">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          className="bg-background border-border text-foreground min-h-[100px]"
          placeholder="Conte um pouco sobre você..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website" className="text-foreground">
            Website
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            className="bg-background border-border text-foreground"
            placeholder="https://seusite.com"
          />
        </div>

        <div>
          <Label htmlFor="github" className="text-foreground">
            GitHub
          </Label>
          <Input
            id="github"
            name="github"
            value={formData.github || ""}
            onChange={handleChange}
            className="bg-background border-border text-foreground"
            placeholder="seu-usuario"
          />
        </div>

        <div>
          <Label htmlFor="twitter" className="text-foreground">
            Twitter
          </Label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter || ""}
            onChange={handleChange}
            className="bg-background border-border text-foreground"
            placeholder="seu-usuario"
          />
        </div>

        <div>
          <Label htmlFor="linkedin" className="text-foreground">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin || ""}
            onChange={handleChange}
            className="bg-background border-border text-foreground"
            placeholder="seu-usuario"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? "Salvando..." : "Salvar Perfil"}
      </Button>
    </form>
  );
}
