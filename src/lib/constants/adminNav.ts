export type AdminTab = "home" | "products" | "form" | "orders" | "custom";

export type AdminScreen = AdminTab | "categories" | "shipping" | "hero";

export interface AdminTabDef {
  key: AdminTab;
  label: string;
  icon: string;
}

export const ADMIN_TABS: AdminTabDef[] = [
  { key: "home", label: "Panel", icon: "▤" },
  { key: "products", label: "Productos", icon: "▦" },
  { key: "form", label: "Nuevo", icon: "＋" },
  { key: "orders", label: "Órdenes", icon: "◉" },
  { key: "custom", label: "Custom", icon: "✦" },
];

export const LOW_STOCK_THRESHOLD = 4;

export type OrderTabValue = "pending" | "confirmed" | "shipped" | "delivered" | "all";

export type ProductFilterValue = "all" | "onSale" | "lowStock" | "outOfStock";

export type ProductSortValue =
  | "recent"
  | "oldest"
  | "nameAsc"
  | "nameDesc"
  | "priceAsc"
  | "priceDesc";

export const PRODUCT_SORT_OPTIONS: { value: ProductSortValue; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "nameAsc", label: "Nombre (A-Z)" },
  { value: "nameDesc", label: "Nombre (Z-A)" },
  { value: "priceAsc", label: "Precio (menor a mayor)" },
  { value: "priceDesc", label: "Precio (mayor a menor)" },
];

