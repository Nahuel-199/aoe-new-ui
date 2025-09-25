"use client";

import { Box, Image, Text, Badge, Button, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      _hover={{ transform: "scale(1.02)" }}
    >
      {product.variants?.[0]?.images?.length ? (
        <Image
          src={product.variants[0].images[0].url}
          alt={product.name}
          w="100%"
          h="250px"
          objectFit="cover"
        />
      ) : (
        <Box w="100%" h="250px" bg="gray.200" />
      )}

      <VStack p={4} gap={2} align="start">
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {product.category?.name} - {product.type}
        </Text>
        <Box display="flex" gap={2} alignItems="center">
          {product.is_offer ? (
            <>
              <Badge as="s" colorScheme="red">
                ${product.price}
              </Badge>
              <Text fontWeight="bold">${product.price_offer}</Text>
            </>
          ) : (
            <Text fontWeight="bold">${product.price}</Text>
          )}
        </Box>
        <Button
          colorScheme="blue"
          w="full"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          Ver más
        </Button>
      </VStack>
    </Box>
  );
}
