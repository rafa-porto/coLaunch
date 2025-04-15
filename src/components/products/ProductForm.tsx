"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Category, ProductFormData } from "@/db/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  categories: Category[];
  product?: any; // Produto existente para edição
  isEdit?: boolean;
}

export function ProductForm({
  categories,
  product,
  isEdit = false,
}: ProductFormProps) {
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
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.tagline.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEdit ? `/api/products/${product.id}` : "/api/products";

      const method = isEdit ? "PUT" : "POST";

      // Gerar slug a partir do título
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
        throw new Error("Falha ao salvar produto");
      }

      toast.success(
        isEdit
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        isEdit ? "Erro ao atualizar produto" : "Erro ao criar produto"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-foreground">
            Título *
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-background border-border text-foreground"
            placeholder="Nome do seu produto"
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
            placeholder="Uma frase curta que descreve seu produto"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-foreground">
            Descrição *
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-background border-border text-foreground min-h-[200px]"
            placeholder="Descreva seu produto em detalhes"
            required
          />
        </div>

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
              placeholder="https://seusite.com"
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
              placeholder="https://github.com/seu-usuario/repositorio"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="categoryId" className="text-foreground">
            Categoria
          </Label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md p-2"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
              placeholder="Adicione tags para seu produto"
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
              Adicionar
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
            placeholder="URL da imagem principal"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Dica: Use serviços como Imgur ou Cloudinary para hospedar suas
            imagens
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-border text-muted-foreground"
          onClick={() => router.push("/profile")}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting
            ? "Salvando..."
            : isEdit
              ? "Atualizar Produto"
              : "Criar Produto"}
        </Button>
      </div>
    </form>
  );
}
