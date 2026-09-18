"use client";

import { Box } from "@chakra-ui/react";
import { Category, Subcategory } from "@/types/product.types";
import ListCategories from "../../categories/ListCategories";
import ListSubcategories from "../../subcategories/ListSubcategories";

interface CategoriesScreenProps {
  categories: Category[];
  subcategories: Subcategory[];
}

export default function CategoriesScreen({ categories, subcategories }: CategoriesScreenProps) {
  return (
    <Box display="grid" gap={8}>
      <ListCategories categories={categories} />
      <ListSubcategories subcategories={subcategories} />
    </Box>
  );
}
