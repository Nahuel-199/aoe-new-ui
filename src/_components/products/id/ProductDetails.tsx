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
  Image,
  Tabs,
  Grid,
  GridItem,
  createListCollection,
  Button,
  Select,
  Portal,
  Container,
} from "@chakra-ui/react";
import { colorMap } from "../utils/ColorMaps";
import { Tooltip } from "@/components/ui/tooltip";
import { useCart } from "@/context/CartContext";

interface ProductByIdProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductByIdProps) {
  const types = Array.from(new Set(product.variants.map((v) => v.type)));
  const [tabValue, setTabValue] = useState<string>(types[0] || "");
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const { addToCart } = useCart();

  return (
    <Container maxW="7xl" py={10}>
      <VStack align="stretch" gap={8} w="full">
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

                    const handleAddToCart = () => {
                      if (selectedSize.length === 0) return;

                      const size = selectedSize[0].split("-")[1];
                      addToCart({
                        productId: product._id.toString(),
                        name: product.name,
                        category: (product.category as any)?.name,
                        subcategories: (product.subcategories as any)?.map((s: any) => s.name),
                        variant: {
                          type: variant.type,
                          color: variant.color,
                          size,
                          price: variant.is_offer && variant.price_offer
                            ? variant.price_offer
                            : variant.price,
                          imageUrl: variant.images[0]?.url
                        },
                        quantity: 1,
                      });
                    };
                    return (
                      <Grid
                        key={idx}
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={8}
                        w="full"
                        borderWidth="1px"
                        borderRadius="lg"
                        p={{ base: 4, md: 6 }}
                      >
                        {/* Columna izquierda - galería */}
                        <GridItem>
                          <VStack gap={4} align={"center"}>
                            <Image
                              src={mainImage}
                              alt={`${variant.color}-${variant.type}`}
                              borderRadius="md"
                              objectFit="cover"
                              w="100%"
                              maxW={{ base: "300px", md: "400px" }}
                              h="auto"
                            />
                            <HStack gap={2} flexWrap="wrap" justify="center">
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

                              {variant.size_chart && (
                                <Image
                                  key="size-chart"
                                  src={variant.size_chart}
                                  alt={`Tabla de talles ${variant.type}`}
                                  boxSize="70px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  cursor="pointer"
                                  border={
                                    mainImage === variant.size_chart
                                      ? "2px solid #3182CE"
                                      : "1px solid #E2E8F0"
                                  }
                                  onClick={() => setMainImage(variant.size_chart!)}
                                />
                              )}
                            </HStack>
                          </VStack>
                        </GridItem>

                        {/* Columna derecha - detalles */}
                        <GridItem>
                          <VStack align="start" gap={5}>
                            <Heading size={{ base: "lg", md: "2xl" }}>{product.name}</Heading>
                            <Text fontSize={{ base: "md", md: "lg" }}>{product.description}</Text>

                            <HStack gap={3} flexWrap={"wrap"}>
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
                              <Badge colorScheme="green">color: </Badge>
                              <Tooltip content={variant.color}>
                                <Box
                                  w="20px"
                                  h="20px"
                                  borderRadius="full"
                                  border="1px solid #ccc"
                                  bg={colorMap[variant.color] || "gray.300"}
                                />
                              </Tooltip>
                            </HStack>

                            <HStack gap={2}>
                              {variant.is_offer && (
                                <Badge colorPalette="red">Oferta</Badge>
                              )}
                            </HStack>

                            <HStack gap={4}>
                              <Text fontWeight="bold">Precio:</Text>
                              <Badge as="s" colorPalette="red">
                                ${variant.price}
                              </Badge>
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
                              size="sm"
                              w={{ base: "full", md: "auto" }}
                              disabled={selectedSize.length === 0}
                              onClick={handleAddToCart}
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
    </Container>
  );
}
