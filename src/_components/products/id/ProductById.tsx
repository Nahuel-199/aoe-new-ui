'use client';

import { Category, Product, Subcategory } from "@/types/product.types";
import ProductFormContainer from "../ProductFormContainer";

interface ProductByIdProps {
  product: Product;
  categories: Category[];
  subcategories: Subcategory[];
}

export default function ProductById({
  product,
  categories,
  subcategories,
}: ProductByIdProps) {
  return (
    <ProductFormContainer
      mode="edit"
      product={product}
      categories={categories}
      subcategories={subcategories}
    />
  );
}
