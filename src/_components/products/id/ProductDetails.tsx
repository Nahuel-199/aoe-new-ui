"use client";

import React, { useState } from "react";
import { Product } from "@/types/product.types";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Image,
  Separator,
  Tabs,
  Grid,
  GridItem,
  createListCollection,
  Button,
  Select,
  Portal,
} from "@chakra-ui/react";

interface ProductByIdProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductByIdProps) {
  const types = Array.from(new Set(product.variants.map((v) => v.type)));
  const [tabValue, setTabValue] = useState<string>(types[0] || "");
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  console.log("PRODUCT ID", product);

  return (
    <VStack align="start" gap={6} p={6} w="full">
      <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)}>
        <Tabs.List>
          {types.map((type) => (
            <Tabs.Trigger key={type} value={type}>
              {type}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {types.map((type) => (
          <Tabs.Content key={type} value={type}>
            <VStack gap={4} align="start">
              {product.variants
                .filter((v) => v.type === type)
                .map((variant, idx) => {
                  const sizesCollection = createListCollection({
                    items: variant.sizes.map((s) => ({
                      label: `${s.size} (${s.stock} disponibles)`,
                      value: `${variant.type}-${s.size}`,
                    })),
                  });

                  const [mainImage, setMainImage] = useState(
                    variant.images[0]?.url
                  );
                  return (
                    <Grid
                      key={idx}
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                      w="full"
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                    >
                      {/* Columna izquierda - galería */}
                      <GridItem>
                        <VStack gap={4}>
                          <Image
                            src={mainImage}
                            alt={`${variant.color}-${variant.type}`}
                            borderRadius="md"
                            objectFit="cover"
                            boxSize={{ base: "300px", md: "400px" }}
                          />
                          <HStack gap={2} wrap="wrap">
                            {variant.images.map((img) => (
                              <Image
                                key={img.id}
                                src={img.url}
                                alt={`${variant.color}-${variant.type}`}
                                boxSize="70px"
                                objectFit="cover"
                                borderRadius="md"
                                cursor="pointer"
                                border={
                                  mainImage === img.url
                                    ? "2px solid #3182CE"
                                    : "1px solid #E2E8F0"
                                }
                                onClick={() => setMainImage(img.url)}
                              />
                            ))}
                          </HStack>
                        </VStack>
                      </GridItem>

                      {/* Columna derecha - detalles */}
                      <GridItem>
                        <VStack align="start" gap={4}>
                          <Heading size="2xl">{product.name}</Heading>
                          <Text fontSize="lg">{product.description}</Text>

                          <HStack gap={4}>
                            <Badge colorScheme="green">
                              Categorias: {product.category.name}
                            </Badge>
                            {product.subcategories.map((sub) => (
                              <Badge key={sub.name} colorScheme="blue">
                                {sub.name}
                              </Badge>
                            ))}
                          </HStack>
                          <HStack gap={2}>
                            <Badge colorScheme="red">
                              Color: {variant.color}
                            </Badge>
                            {variant.is_offer && (
                              <Badge colorPalette="red">Oferta</Badge>
                            )}
                          </HStack>

                          <HStack gap={4}>
                            <Text fontWeight="bold">Precio:</Text>
                            <Text
                              fontSize="xl"
                              textDecoration={
                                variant.is_offer ? "line-through" : "none"
                              }
                              color={variant.is_offer ? "red.500" : "gray"}
                            >
                              ${variant.price}
                            </Text>
                            {variant.is_offer && variant.price_offer && (
                              <Text
                                fontSize="2xl"
                                color="white"
                                fontWeight="bold"
                              >
                                ${variant.price_offer}
                              </Text>
                            )}
                          </HStack>

                          <Box w="full">
                            <Select.Root
                              collection={sizesCollection}
                              value={selectedSize}
                              onValueChange={(e) => setSelectedSize(e.value)}
                              width="100%"
                            >
                              <Select.HiddenSelect />
                              <Select.Label>Selecciona un talle</Select.Label>
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Elegir talle" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {sizesCollection.items.map((s) => (
                                      <Select.Item item={s} key={s.value}>
                                        {s.label}
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          </Box>

                          <Button
                            colorPalette="red"
                            size="lg"
                            disabled={selectedSize.length === 0}
                          >
                            Agregar al carrito
                          </Button>
                        </VStack>
                      </GridItem>
                    </Grid>
                  );
                })}
            </VStack>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </VStack>
  );
}
