"use client";

import {
  Box,
  Image,
  Text,
  Badge,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";
import { Tooltip } from "@/components/ui/tooltip";
import { getColorHex } from "./utils/ColorMaps";
import { useState } from "react";
import FavoriteButton from "./FavoriteButton";

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

  const offerVariant = product.variants.find((v) => v.is_offer);
  const basePrice = offerVariant?.price ?? product.variants[0]?.price;
  const finalPrice = offerVariant?.price_offer ?? product.variants[0]?.price;
  const discountPct = offerVariant?.price
    ? Math.round((1 - (offerVariant.price_offer ?? offerVariant.price) / offerVariant.price) * 100)
    : 0;

  return (
    <Box minW={0}>
      <Box
        role="button"
        tabIndex={0}
        onClick={() => router.push(`/products/${product._id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/products/${product._id}`);
          }
        }}
        p={0}
        w="100%"
        bg="aoe.surface"
        borderRadius="16px"
        overflow="hidden"
        position="relative"
        aspectRatio="4 / 5"
        display="block"
        cursor="pointer"
        _hover={{ outline: "2px solid", outlineColor: "aoe.red" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FavoriteButton productId={product._id} variant="overlay" />
        {imageToShow ? (
          <Image
            src={imageToShow}
            alt={product.name}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="all 0.3s ease-in-out"
          />
        ) : (
          <Box w="100%" h="100%" bg="aoe.tile" />
        )}
        {offerVariant && (
          <Badge
            position="absolute"
            top="10px"
            left="10px"
            bg="aoe.red"
            color="white"
            borderRadius="6px"
            px="8px"
            py="4px"
            fontFamily="mono"
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            -{discountPct}%
          </Badge>
        )}
      </Box>

      <Flex justify="space-between" gap="10px" mt="12px" align="baseline">
        <Text fontSize="14px" fontWeight="700" color="aoe.text" minW={0}>
          {product.name}
        </Text>
        <Box textAlign="right" whiteSpace="nowrap">
          {offerVariant && (
            <Text as="s" color="aoe.textGhost" fontSize="12px" mr="6px">
              ${basePrice}
            </Text>
          )}
          <Text as="span" fontSize="14px" fontWeight="800" color="aoe.text">
            ${finalPrice}
          </Text>
        </Box>
      </Flex>

      <Text
        fontFamily="mono"
        fontSize="10px"
        color="aoe.textFaint"
        letterSpacing="0.08em"
        textTransform="uppercase"
        mt="5px"
      >
        {product.category?.name}
        {product.subcategories?.length ? " · " + product.subcategories.map((e) => e.name).join(", ") : ""}
        {uniqueTypes.length ? " · " + uniqueTypes.join(" - ") : ""}
      </Text>

      {uniqueColors.length > 0 && (
        <HStack gap="6px" mt="6px">
          {uniqueColors.map((color, i) => (
            <Tooltip key={i} content={color}>
              <Box
                w="16px"
                h="16px"
                borderRadius="full"
                border="1.5px solid"
                borderColor="aoe.textFaint"
                bg={getColorHex(color) || "gray.300"}
              />
            </Tooltip>
          ))}
        </HStack>
      )}
    </Box>
  );
}
