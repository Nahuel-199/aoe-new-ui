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
}
