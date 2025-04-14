"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpvoteButtonProps {
  productId: number;
  hasUpvoted: boolean;
  isLoggedIn: boolean;
}

export function UpvoteButton({
  productId,
  hasUpvoted,
  isLoggedIn,
}: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(hasUpvoted);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpvote = async () => {
    if (!isLoggedIn) {
      toast.error("Você precisa estar logado para votar");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao processar upvote");
      }

      const data = await response.json();
      setIsUpvoted(data.hasUpvoted);

      toast.success(data.hasUpvoted ? "Upvote adicionado!" : "Upvote removido");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao processar upvote");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpvote}
      disabled={isLoading}
      className={
        isUpvoted
          ? "w-full bg-primary hover:bg-primary/90"
          : "w-full bg-muted hover:bg-muted/80"
      }
    >
      {isLoading ? "Processando..." : isUpvoted ? "Upvoted ⬆️" : "Upvote ⬆️"}
    </Button>
  );
}
