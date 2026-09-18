"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";
import { Box, Flex, VStack, Tabs, Button, Container } from "@chakra-ui/react";
import OfferSlider from "@/_components/home/offer/OfferSlider";
import VariantCard from "./VariantCard";
import FavoriteButton from "../FavoriteButton";

interface ProductByIdProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductByIdProps) {
  const router = useRouter();
  const types = Array.from(new Set(product.variants.map((v) => v.type)));
  const [tabValue, setTabValue] = useState<string>(types[0] || "");

  return (
    <Container maxW="1360px" py={{ base: 7, md: "28px" }}>
      <Flex justify="space-between" align="center" mb={5}>
        <Button
          variant="ghost"
          color="aoe.textFaint"
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          px={0}
          _hover={{ color: "aoe.text", bg: "transparent" }}
          onClick={() => router.push("/products")}
        >
          ← Volver al catálogo
        </Button>

        <FavoriteButton productId={product._id} variant="inline" />
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
                    <VariantCard key={idx} product={product} variant={variant} />
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
