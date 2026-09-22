export interface Category {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: string;
  name: string;
}

export interface Variant {
  type: string;
  price: number;
  is_offer: boolean;
  price_offer?: number;
  color: string;
  images: { id: string; url: string }[];
  sizes: { size: string; stock: number }[];
  size_chart?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: Category;
  subcategories: Subcategory[];
  variants: Variant[];
  createdAt?: string;
}

// Nota: estos tipos/constantes viven acá (y no en product.actions.ts) porque
// ese archivo tiene "use server" — Next.js solo permite exportar funciones
// async desde un módulo "use server"; cualquier otro export (tipos, const)
// rompe el bundling de esas server actions.

export interface ImageInput {
  id: string;
  url: string;
}

export interface VariantInput {
  type: string;
  price: number;
  is_offer: boolean;
  price_offer?: number;
  color: string;
  images: ImageInput[];
  sizes: { size: string; stock: number }[];
  size_chart?: string;
}

export const PRODUCTS_PAGE_SIZE = 12;

export type ProductSort = "relevancia" | "menor" | "mayor";

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: ProductSort;
  onlyOffers?: boolean;
}

export interface GetProductsResult {
  products: Product[];
  total: number;
}
