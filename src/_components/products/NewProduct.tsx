'use client';

import { Category, Subcategory } from "@/types/product.types";
import ProductFormContainer from "./ProductFormContainer";

interface NewProductProps {
  categories: Category[];
  subcategories: Subcategory[];
}

export default function NewProduct({ categories, subcategories }: NewProductProps) {
  return (
    <ProductFormContainer
      mode="create"
      categories={categories}
      subcategories={subcategories}
    />
  );
}
