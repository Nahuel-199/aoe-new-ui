"use client";

import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";
import { Tooltip } from "@/components/ui/tooltip";
import { colorMap } from "./utils/ColorMaps";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const uniqueTypes = Array.from(new Set(product.variants.map((v) => v.type)));
  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color))
  );

  const firstVariantImages = product.variants?.[0]?.images || [];
  const imageToShow = isHovered && firstVariantImages.length > 1
    ? firstVariantImages[1].url
    : firstVariantImages[0]?.url;

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      transition="all 0.2s"
      _hover={{ transform: "scale(1.02)" }}
    >
      {imageToShow ? (
        <Image
          src={imageToShow}
          alt={product.name}
          w="100%"
          h="250px"
          objectFit="cover"
          onClick={() => router.push(`/products/${product._id}`)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          cursor={"pointer"}
          transition="all 0.3s ease-in-out"
        />
      ) : (
        <Box w="100%" h="250px" bg="gray.200" />
      )}

      <VStack p={4} gap={2} align="start" textAlign={"center"}>
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign={"center"}>
          Categorias: {product.category?.name} -{" "}
          {product.subcategories?.map((e) => e.name)}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign={"center"}>
          Tipo: {uniqueTypes.join(" - ")}
        </Text>
        <HStack gap={2}>
          {uniqueColors.map((color, i) => (
            <Tooltip key={i} content={color}>
              <Box
                w="20px"
                h="20px"
                borderRadius="full"
                border="1px solid #ccc"
                bg={colorMap[color] || "gray.300"}
              />
            </Tooltip>
          ))}
        </HStack>
        <Box display="flex" gap={2} alignItems="center">
          {product.variants.some((v) => v.is_offer) ? (
            <>
              <Badge as="s" colorPalette="red">
                ${product.variants.find((v) => v.is_offer)?.price}
              </Badge>
              <Text fontWeight="bold">
                ${product.variants.find((v) => v.is_offer)?.price_offer}
              </Text>
            </>
          ) : (
            <Text fontWeight="bold">${product.variants[0]?.price}</Text>
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
