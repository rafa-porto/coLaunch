import { NavigationSection } from "../types/navigation";

export const navigationData: NavigationSection[] = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", icon: "layoutDashboard", href: "/dashboard" },
      { label: "Perfil", icon: "user", href: "/dashboard/profile" },
    ],
  },
  {
    title: "Produtos",
    items: [
      { label: "Meus Produtos", icon: "package", href: "/dashboard/products" },
      { label: "Novo Produto", icon: "plus", href: "/dashboard/products/new" },
      { label: "Explorar", icon: "search", href: "/products" },
    ],
  },
  {
    title: "Categorias",
    items: [
      { label: "Todas", icon: "grid", href: "/products" },
      { label: "Em Destaque", icon: "star", href: "/products?featured=true" },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        label: "Gerenciar Produtos",
        icon: "listChecks",
        href: "/dashboard/admin/products",
      },
      {
        label: "Gerenciar Categorias",
        icon: "tag",
        href: "/dashboard/admin/categories",
      },
      {
        label: "Gerenciar Usuários",
        icon: "users",
        href: "/dashboard/admin/users",
      },
    ],
  },
];
