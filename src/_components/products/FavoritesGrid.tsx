"use client";

import { SimpleGrid, VStack, Icon, Text } from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";
import { Product } from "@/types/product.types";
import { useFavorites } from "@/context/FavoritesContext";
import ProductCard from "./ProductCard";

interface FavoritesGridProps {
  products: Product[];
}

export default function FavoritesGrid({ products }: FavoritesGridProps) {
  const { favoriteIds, loading } = useFavorites();

  // Mientras el contexto no cargó los ids todavía mostramos la lista que
  // vino del server, así evitamos un flash del estado vacío al entrar.
  const visible = loading ? products : products.filter((p) => favoriteIds.has(p._id));

  if (visible.length === 0) {
    return (
      <VStack
        py={12}
        px={5}
        gap={4}
        border="1px dashed"
        borderColor="aoe.borderControl"
        borderRadius="16px"
        textAlign="center"
      >
        <Icon as={FaRegHeart} boxSize={12} color="aoe.textFaint" />
        <Text fontFamily="heading" fontSize="28px" textTransform="uppercase" color="aoe.text">
          Todavía no tenés favoritos
        </Text>
        <Text color="aoe.textSubtle" fontSize="14px">
          Marcá el corazón en cualquier producto del catálogo para guardarlo acá.
        </Text>
      </VStack>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="16px" mt={4}>
      {visible.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </SimpleGrid>
  );
}
