"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { Product } from "@/types/product.types";
import { Box, Flex, HStack, VStack, Tabs, Button, Container } from "@chakra-ui/react";
import OfferSlider from "@/_components/home/offer/OfferSlider";
import VariantCard from "./VariantCard";
import FavoriteButton from "../FavoriteButton";
import ShareButton from "../ShareButton";

interface ProductByIdProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductByIdProps) {
  const types = Array.from(new Set(product.variants.map((v) => v.type)));
  const [tabValue, setTabValue] = useState<string>(types[0] || "");

  return (
    <Container maxW="1360px" py={{ base: 7, md: "28px" }}>
      <Flex justify="space-between" align="center" mb={5}>
        <Button
          asChild
          variant="ghost"
          color="aoe.textFaint"
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          px={0}
          _hover={{ color: "aoe.text", bg: "transparent" }}
        >
          <NextLink href="/products">← Volver al catálogo</NextLink>
        </Button>

        <HStack gap={2}>
          <ShareButton productId={product._id} productName={product.name} />
          <FavoriteButton productId={product._id} variant="inline" />
        </HStack>
      </Flex>

      <VStack align="stretch" gap={8} w="full">
        <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)}>
          <Tabs.List borderColor="aoe.borderSubtle" mb={2}>
            {types.map((type) => (
              <Tabs.Trigger
                key={type}
                value={type}
                color="aoe.textMuted"
                fontFamily="mono"
                fontSize="12px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                _selected={{ color: "aoe.red", borderColor: "aoe.red" }}
              >
                {type}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {types.map((type) => (
            <Tabs.Content key={type} value={type}>
              <VStack gap={6} align="start">
                {product.variants
                  .filter((v) => v.type === type)
                  .map((variant, idx) => (
                    <VariantCard
                      key={idx}
                      product={product}
                      variant={variant}
                      headingAs={type === types[0] && idx === 0 ? "h1" : "h2"}
                    />
                  ))}
              </VStack>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </VStack>
      <Box mt={16}>
        <OfferSlider title="Combinan con esto" />
      </Box>
    </Container>
  );
}
