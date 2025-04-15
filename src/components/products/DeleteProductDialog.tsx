"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteProductDialogProps {
  productId: number;
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteProductDialog({
  productId,
  productTitle,
  isOpen,
  onClose,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao excluir o produto");
      }

      toast.success("Produto excluído com sucesso");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir produto"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Produto
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o produto{" "}
            <span className="font-semibold">{productTitle}</span>? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 mt-2">
          <p className="text-sm text-destructive">
            Ao excluir este produto, você também removerá:
          </p>
          <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
            <li>• Todos os upvotes recebidos</li>
            <li>• Todos os comentários</li>
            <li>• Todas as tags associadas</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>Excluindo...</>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Excluir Produto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
