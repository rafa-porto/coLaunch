import { redirect } from "next/navigation";

export default function ProductsPage() {
  // Redirecionar para a página de perfil
  redirect("/profile");
  
  // Este código nunca será executado devido ao redirecionamento
  return null;
}
