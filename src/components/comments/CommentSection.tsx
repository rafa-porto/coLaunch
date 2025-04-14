"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentWithUser } from "@/db/types";
import { CommentItem } from "./CommentItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CommentSectionProps {
  productId: number;
  comments: CommentWithUser[];
  isLoggedIn: boolean;
}

export function CommentSection({
  productId,
  comments,
  isLoggedIn,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Você precisa estar logado para comentar");
      router.push("/sign-in");
      return;
    }

    if (!content.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar comentário");
      }

      setContent("");
      toast.success("Comentário enviado com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao enviar comentário");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Comentários ({comments.length})
      </h2>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder={
            isLoggedIn ? "Deixe seu comentário..." : "Faça login para comentar"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isLoggedIn || isSubmitting}
          className="bg-card border-border text-foreground mb-3 min-h-[100px]"
        />
        <Button
          type="submit"
          disabled={!isLoggedIn || isSubmitting || !content.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Enviando..." : "Enviar Comentário"}
        </Button>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              productId={productId}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </div>
    </div>
  );
}
