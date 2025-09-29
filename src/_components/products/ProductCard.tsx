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
          cursor={"pointer"}
        />
      ) : (
        <Box w="100%" h="250px" bg="gray.200" />
      )}

      <VStack p={4} gap={2} align="start" textAlign={"center"}>
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign={"center"}>
          {product.category?.name} - {product.subcategories?.map((e => e.name))}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign={"center"}>
          {product.variants.map(( e => e.type)).join(" - ")}
        </Text>
        <Box display="flex" gap={2} alignItems="center">
          {product.variants.map(( e => e.is_offer)) ? (
            <>
              <Badge as="s" colorPalette="red">
                ${product.variants.map((v) => v.price)[0]}
              </Badge>
              <Text fontWeight="bold">${product.variants.map((v) => v.price_offer)[0]}</Text>
            </>
          ) : (
            <Text fontWeight="bold">${product.variants.map((v) => v.price)[0]}</Text>
          )}
        </Box>
        <Button
          colorScheme="blue"
          w="full"
          mb={2}
          mt={2}
          onClick={() => router.push(`/products/${product._id}`)}
        >
          Ver más
        </Button>
      </VStack>
    </Box>
  );
}
