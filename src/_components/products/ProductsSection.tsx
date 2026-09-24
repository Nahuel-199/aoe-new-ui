"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, PRODUCTS_PAGE_SIZE, Product, Subcategory } from "@/types/product.types";
import { Box, SimpleGrid, VStack, Icon, Text, Button } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductFilters, { SortOption } from "./ProductFilters";
import { FaBoxOpen } from "react-icons/fa";
import { getProducts } from "@/lib/actions/product.actions";

const OFFERS_CHIP = "offers";

interface ResolvedFilters {
  categoryId?: string;
  onlyOffers: boolean;
  categoryLabel?: string;
  subcategoryId?: string;
  search: string;
  sort: SortOption;
}

interface ProductsSectionProps {
  products: Product[];
  total: number;
  categories: Category[];
  subcategories: Subcategory[];
  filters: ResolvedFilters;
}

export default function ProductsSection({
  products: initialProducts,
  total,
  categories,
  subcategories,
  filters,
}: ProductsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
  }, [initialProducts]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) updateParam("q", searchInput || undefined);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/products?${next.toString()}`);
  };

  const handleCategoryChange = (id: string) => {
    if (!id) return updateParam("category", undefined);
    if (id === OFFERS_CHIP) return updateParam("category", "Ofertas");
    const category = categories.find((c) => c._id === id);
    updateParam("category", category?.name);
  };

  const handleSubcategoryChange = (id: string) => updateParam("subcategory", id || undefined);
  const handleSortChange = (sort: SortOption) =>
    updateParam("sort", sort === "relevancia" ? undefined : sort);
  const handleClearFilters = () => {
    setSearchInput("");
    router.push("/products");
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getProducts({
        page: nextPage,
        pageSize: PRODUCTS_PAGE_SIZE,
        category: filters.categoryId,
        subcategory: filters.subcategoryId,
        search: filters.search || undefined,
        sort: filters.sort,
        onlyOffers: filters.onlyOffers,
      });
      setProducts((prev) => [...prev, ...res.products]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const selectedCategory = filters.onlyOffers ? OFFERS_CHIP : filters.categoryId ?? "";

  return (
    <Box maxW="1360px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 9, md: "36px" }}>
      <Text
        fontFamily="mono"
        fontSize="11px"
        color="aoe.textFaint"
        letterSpacing="0.12em"
        textTransform="uppercase"
        mb="14px"
      >
        Inicio / Catálogo
      </Text>
      <Text
        as="h1"
        fontFamily="heading"
        fontSize={{ base: "36px", md: "clamp(36px, 7vw, 76px)" }}
        lineHeight="0.9"
        textTransform="uppercase"
        color="aoe.text"
        mb="6px"
      >
        {filters.categoryLabel ?? "Catálogo"}
      </Text>
      <Text color="aoe.textSubtle" fontSize="14px" mb="26px">
        {total} {total === 1 ? "producto" : "productos"} · precios finales en pesos
      </Text>

      <ProductFilters
        categories={categories}
        subcategories={subcategories}
        selectedCategory={selectedCategory}
        selectedSubcategory={filters.subcategoryId ?? ""}
        search={searchInput}
        sort={filters.sort}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
        onSearchChange={setSearchInput}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {products.length === 0 ? (
        <VStack
          py={12}
          px={5}
          gap={4}
          border="1px dashed"
          borderColor="aoe.borderControl"
          borderRadius="16px"
          textAlign="center"
        >
          <Icon as={FaBoxOpen} boxSize={12} color="aoe.textFaint" />
          <Text fontFamily="heading" fontSize="28px" textTransform="uppercase" color="aoe.text">
            Sin resultados
          </Text>
          <Text color="aoe.textSubtle" fontSize="14px">
            Probá con otro personaje o quitá los filtros.
          </Text>
          <Button
            onClick={handleClearFilters}
            h="44px"
            px="22px"
            borderRadius="pill"
            border="none"
            bg="aoe.text"
            color="aoe.bg"
            fontFamily="mono"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.08em"
            textTransform="uppercase"
            _hover={{ bg: "aoe.red", color: "white" }}
          >
            Limpiar filtros
          </Button>
        </VStack>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="16px" mt={4}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>

          {products.length < total && (
            <Box textAlign="center" mt="32px">
              <Button
                onClick={loadMore}
                loading={loadingMore}
                h="48px"
                px="28px"
                borderRadius="pill"
                border="1px solid"
                borderColor="aoe.borderControl"
                bg="transparent"
                color="aoe.text"
                fontFamily="mono"
                fontSize="12px"
                fontWeight="800"
                letterSpacing="0.08em"
                textTransform="uppercase"
                _hover={{ borderColor: "aoe.text" }}
              >
                Cargar más
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
