'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentWithUser } from "@/db/types";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CommentItemProps {
  comment: CommentWithUser;
  productId: number;
  isLoggedIn: boolean;
  isReply?: boolean;
}

export function CommentItem({ comment, productId, isLoggedIn, isReply = false }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error("Você precisa estar logado para responder");
      router.push("/sign-in");
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error("A resposta não pode estar vazia");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: replyContent,
          parentId: comment.id
        }),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao enviar resposta");
      }
      
      setReplyContent("");
      setIsReplying(false);
      toast.success("Resposta enviada com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao enviar resposta");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-4' : ''}`}>
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#424242]">
        <div className="flex items-start gap-3 mb-3">
          {comment.user.image ? (
            <Image 
              src={comment.user.image} 
              alt={comment.user.name} 
              width={40} 
              height={40} 
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#424242] flex items-center justify-center text-white">
              {comment.user.name.charAt(0)}
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{comment.user.name}</span>
              <span className="text-sm text-[#7a7a7a]">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-[#e0e0e0] mt-1">{comment.content}</p>
          </div>
        </div>
        
        {!isReply && (
          <div className="ml-12">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[#7a7a7a] hover:text-white hover:bg-[#424242]"
            >
              {isReplying ? "Cancelar" : "Responder"}
            </Button>
          </div>
        )}
      </div>
      
      {/* Formulário de resposta */}
      {isReplying && (
        <div className="ml-12 mt-3">
          <form onSubmit={handleReply}>
            <Textarea
              placeholder="Escreva sua resposta..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={isSubmitting}
              className="bg-[#2a2a2a] border-[#424242] text-white mb-2"
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || !replyContent.trim()}
                size="sm"
                className="bg-[#b17f01] hover:bg-[#8a6401]"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsReplying(false)}
                className="border-[#424242] text-[#7a7a7a]"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Respostas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              productId={productId}
              isLoggedIn={isLoggedIn}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
