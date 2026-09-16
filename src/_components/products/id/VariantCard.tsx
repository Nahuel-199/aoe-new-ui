"use client";

import React, { useState } from "react";
import { Product, Variant } from "@/types/product.types";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Image,
  Grid,
  GridItem,
  Button,
  Dialog,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { colorMap } from "../utils/ColorMaps";
import { Tooltip } from "@/components/ui/tooltip";
import { useCart } from "@/context/CartContext";
import { showToast } from "nextjs-toast-notify";

interface VariantCardProps {
  product: Product;
  variant: Variant;
}

export default function VariantCard({ product, variant }: VariantCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(variant.images[0]?.url);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { addToCart } = useCart();

  const pickSize = (size: string) => {
    setSelectedSize((prev) => (prev === size ? null : size));
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      productId: product._id.toString(),
      name: product.name,
      category: product.category?.name,
      subcategories: product.subcategories?.map((s) => s.name),
      variant: {
        type: variant.type,
        color: variant.color,
        size: selectedSize,
        price:
          variant.is_offer && variant.price_offer
            ? variant.price_offer
            : variant.price,
        imageUrl: variant.images[0]?.url,
      },
      quantity: 1,
    });
    showToast.success("¡Producto agregado con éxito!", {
      duration: 4000,
      progress: true,
      position: "top-center",
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  };

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10} w="full" alignItems="start">
      <GridItem minW={0}>
        <Box
          position="relative"
          bg="aoe.surface"
          borderRadius="20px"
          overflow="hidden"
          aspectRatio="4 / 5"
        >
          <Image
            src={mainImage}
            alt={`${variant.color}-${variant.type}`}
            objectFit="cover"
            w="100%"
            h="100%"
            cursor="zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />
          {variant.is_offer && (
            <Badge
              position="absolute"
              top="14px"
              left="14px"
              bg="aoe.red"
              color="white"
              borderRadius="6px"
              px="10px"
              py="6px"
              fontFamily="mono"
              fontSize="11px"
              fontWeight="700"
            >
              Oferta
            </Badge>
          )}
        </Box>

        <Dialog.Root
          open={isZoomOpen}
          onOpenChange={(e) => setIsZoomOpen(e.open)}
          size="xl"
          placement="center"
        >
          <Dialog.Backdrop bg="rgba(0,0,0,0.75)" />
          <Dialog.Positioner>
            <Dialog.Content bg="aoe.bgAlt" borderColor="aoe.borderSubtle">
              <Dialog.Body p={0}>
                <Image
                  src={mainImage}
                  alt={`${variant.color}-${variant.type}`}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" colorPalette={"red"} variant={"solid"} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>

        <HStack gap={2} flexWrap="wrap" justify="center" mt={3}>
          {variant.images.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              alt={`${variant.color}-${variant.type}`}
              boxSize="70px"
              objectFit="cover"
              borderRadius="10px"
              cursor="pointer"
              border="2px solid"
              borderColor={mainImage === img.url ? "aoe.red" : "aoe.borderSubtle"}
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
              borderRadius="10px"
              cursor="pointer"
              border="2px solid"
              borderColor={mainImage === variant.size_chart ? "aoe.red" : "aoe.borderSubtle"}
              onClick={() => setMainImage(variant.size_chart!)}
            />
          )}
        </HStack>
      </GridItem>

      <GridItem minW={0}>
        <VStack align="start" gap={0}>
          <Text
            fontFamily="mono"
            fontSize="11px"
            color="aoe.red"
            letterSpacing="0.14em"
            textTransform="uppercase"
          >
            {product.category?.name}
          </Text>
          <Text
            fontFamily="heading"
            fontSize={{ base: "34px", md: "clamp(34px, 5vw, 56px)" }}
            lineHeight="0.94"
            textTransform="uppercase"
            color="aoe.text"
            mt="10px"
          >
            {product.name}
          </Text>

          <HStack gap={2} flexWrap="wrap" mt={4}>
            {product.subcategories.map((sub) => (
              <Badge
                key={sub.name}
                borderRadius="pill"
                bg="aoe.chip"
                color="aoe.textMuted"
                border="1px solid"
                borderColor="aoe.borderControl"
                fontFamily="mono"
                fontSize="10px"
                px="10px"
              >
                {sub.name}
              </Badge>
            ))}
          </HStack>

          <HStack gap={2} mt={4}>
            <Text
              fontFamily="mono"
              fontSize="11px"
              color="aoe.textFaint"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              Color
            </Text>
            <Tooltip content={variant.color}>
              <Box
                w="20px"
                h="20px"
                borderRadius="full"
                border="1.5px solid"
                borderColor="aoe.textFaint"
                bg={colorMap[variant.color] || "gray.300"}
              />
            </Tooltip>
          </HStack>

          <HStack align="baseline" gap={3} mt={5} flexWrap="wrap">
            {variant.is_offer && variant.price_offer ? (
              <>
                <Text fontSize="34px" fontWeight="800" letterSpacing="-0.01em" color="aoe.text">
                  ${variant.price_offer}
                </Text>
                <Text as="s" color="aoe.textGhost" fontSize="18px">
                  ${variant.price}
                </Text>
              </>
            ) : (
              <Text fontSize="34px" fontWeight="800" letterSpacing="-0.01em" color="aoe.text">
                ${variant.price}
              </Text>
            )}
          </HStack>

          <Box h="1px" bg="aoe.borderSubtle" w="full" my={6} />

          <Text
            fontFamily="mono"
            fontSize="11px"
            color="aoe.textMuted"
            letterSpacing="0.12em"
            textTransform="uppercase"
            mb="10px"
          >
            Talle
          </Text>
          <Flex gap="8px" flexWrap="wrap">
            {variant.sizes.map((s) => {
              const disabled = s.stock === 0;
              const on = selectedSize === s.size;
              return (
                <Button
                  key={s.size}
                  onClick={() => !disabled && pickSize(s.size)}
                  disabled={disabled}
                  w="56px"
                  h="52px"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor={on ? "aoe.red" : disabled ? "aoe.borderSubtle" : "aoe.borderControl"}
                  bg={on ? "aoe.red" : disabled ? "aoe.bgAlt" : "transparent"}
                  color={on ? "white" : disabled ? "aoe.textDisabled" : "aoe.text"}
                  fontSize="14px"
                  fontWeight="800"
                  letterSpacing="0.04em"
                >
                  {s.size}
                </Button>
              );
            })}
          </Flex>

          <Button
            mt={7}
            w={{ base: "full", md: "auto" }}
            minW="220px"
            h="58px"
            borderRadius="pill"
            border="none"
            bg="aoe.red"
            color="white"
            fontFamily="mono"
            fontSize="14px"
            fontWeight="800"
            letterSpacing="0.1em"
            textTransform="uppercase"
            disabled={!selectedSize}
            _hover={{ bg: "aoe.text", color: "aoe.bg" }}
            onClick={handleAddToCart}
          >
            {selectedSize ? "Agregar al carrito" : "Elegí un talle"}
          </Button>

          {product.description && (
            <Text
              mt={6}
              pt={5}
              borderTop="1px solid"
              borderColor="aoe.borderSubtle"
              color="aoe.textSubtle"
              fontSize="14px"
              lineHeight="1.6"
            >
              {product.description}
            </Text>
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
}
