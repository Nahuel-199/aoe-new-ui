export type AdminTab = "home" | "products" | "form" | "orders" | "custom";

export type AdminScreen = AdminTab | "categories" | "shipping";

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

