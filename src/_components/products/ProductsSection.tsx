"use client";

import React, { useMemo, useState } from "react";
import { Category, Product, Subcategory } from "@/types/product.types";
import { Box, SimpleGrid, VStack, Icon, Text } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { FaBoxOpen } from "react-icons/fa";

interface ProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
}

export default function ProductsSection({
  products,
  categories,
  subcategories,
}: ProductsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(p.category?._id);

      const matchesSubcategory =
        selectedSubcategory.length === 0 ||
        p.subcategories?.some((s) => selectedSubcategory.includes(s._id));

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [products, search, selectedCategory, selectedSubcategory]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory([]);
    setSelectedSubcategory([]);
  };

  return (
    <Box p={6}>
      <ProductFilters
        categories={categories}
        subcategories={subcategories}
        selectedCategory={selectedCategory[0] ?? ""}
        selectedSubcategory={selectedSubcategory[0] ?? ""}
        search={search}
        onCategoryChange={(id) => setSelectedCategory(id ? [id] : [])}
        onSubcategoryChange={(id) => setSelectedSubcategory(id ? [id] : [])}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
      />
      {filteredProducts.length === 0 ? (
        <VStack py={10} gap={4} color="gray.500">
          <Icon as={FaBoxOpen} boxSize={12} />
          <Text fontSize="lg" fontWeight="medium">
            No hay productos disponibles en esta categoría
          </Text>
          <Text fontSize="sm">
            Intenta seleccionar otra categoría o limpiar los filtros
          </Text>
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} mt={4}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
