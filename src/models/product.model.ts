import clientPromise from "@/lib/db";

export interface Image {
  id: string;
  url: string;
}

export interface VariantSize {
  size: string;
  stock: number;
}

export interface Variant {
  type: string;
  price: number;
  is_offer: boolean;
  price_offer: number | null;
  color: string;
  images: Image[];
  size_chart?: string;
  sizes: VariantSize[];
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  subcategories: string[];
  variants: Variant[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Product>("products");
}