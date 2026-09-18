export interface NavLink {
  label: string;
  href: string;
  category?: string;
  requiresAuth?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Todo", href: "/products" },
  { label: "Remeras", href: "/products?category=Remeras", category: "Remeras" },
  { label: "Buzos", href: "/products?category=Buzos", category: "Buzos" },
  { label: "Ofertas", href: "/products?category=Ofertas", category: "Ofertas" },
  { label: "Personalizados", href: "/personalizados" },
  { label: "Mis pedidos", href: "/mis-pedidos", requiresAuth: true },
  { label: "Favoritos", href: "/favoritos", requiresAuth: true },
];

export function isNavLinkActive(
  link: NavLink,
  pathname: string,
  category: string | null
): boolean {
  if (link.href.startsWith("/products")) {
    if (pathname !== "/products") return false;
    return link.category ? category === link.category : !category;
  }
  return pathname === link.href;
}
