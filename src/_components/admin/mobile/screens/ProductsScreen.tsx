"use client";

import { useMemo } from "react";
import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import { Product } from "@/types/product.types";
import { ProductFilterValue } from "@/lib/constants/adminNav";
import { getDisplayPricing, getTotalStock, isLowStock, isOnSale, isOutOfStock } from "@/lib/productStock";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

const CHIPS: { value: ProductFilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "onSale", label: "En oferta" },
  { value: "lowStock", label: "Stock bajo" },
  { value: "outOfStock", label: "Sin stock" },
];

interface ProductsScreenProps {
  products: Product[];
  query: string;
  onQueryChange: (q: string) => void;
  filter: ProductFilterValue;
  onFilterChange: (f: ProductFilterValue) => void;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onOpenMenu: (product: Product) => void;
}

export default function ProductsScreen({
  products,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  onCreate,
  onEdit,
  onOpenMenu,
}: ProductsScreenProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.subcategories.map((s) => s.name).join(" ")} ${p.variants
          .map((v) => v.type)
          .join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filter === "onSale") return isOnSale(p);
      if (filter === "lowStock") return isLowStock(p);
      if (filter === "outOfStock") return isOutOfStock(p);
      return true;
    });
  }, [products, query, filter]);

  return (
    <Box>
      <Flex gap="10px" align="center">
        <Flex
          flex={1}
          align="center"
          gap="10px"
          h="50px"
          px="14px"
          border="1px solid"
          borderColor="aoe.borderControl"
          bg="aoe.tile"
          borderRadius="14px"
        >
          <Text color="aoe.textMuted" fontSize="15px">
            ⌕
          </Text>
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar producto…"
            flex={1}
            minW={0}
            bg="transparent"
            border="none"
            outline="none"
            color="aoe.text"
            fontSize="16px"
            px={0}
            h="auto"
            _focusVisible={{ outline: "none" }}
          />
        </Flex>
        <Box
          as="button"
          onClick={onCreate}
          w="50px"
          h="50px"
          borderRadius="14px"
          border="none"
          bg="aoe.red"
          color="white"
          fontSize="22px"
          flexShrink={0}
        >
          +
        </Box>
      </Flex>

      <Flex gap="8px" overflowX="auto" py="14px">
        {CHIPS.map((c) => {
          const active = filter === c.value;
          return (
            <Box
              key={c.value}
              as="button"
              onClick={() => onFilterChange(c.value)}
              flexShrink={0}
              h="36px"
              px="14px"
              borderRadius="pill"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg={active ? "aoe.red" : "aoe.chip"}
              color={active ? "white" : "aoe.textMuted"}
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.04em"
              textTransform="uppercase"
            >
              {c.label}
            </Box>
          );
        })}
      </Flex>

      <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase" my="12px">
        {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
      </Text>

      <Box display="grid" gap="10px">
        {filtered.map((p) => {
          const { basePrice, finalPrice, onSale } = getDisplayPricing(p);
          const stock = getTotalStock(p);
          const outOfStock = stock === 0;
          const lowStock = !outOfStock && isLowStock(p);
          const thumb = p.variants[0]?.images?.[0]?.url;
          const meta = [p.category?.name, p.subcategories?.map((s) => s.name).join(", "), [
            ...new Set(p.variants.map((v) => v.type)),
          ].join(" - ")]
            .filter(Boolean)
            .join(" · ");

          return (
            <Box
              key={p._id}
              border="1px solid"
              borderColor="aoe.borderSubtle"
              bg="aoe.tile"
              borderRadius="16px"
              p={3}
              display="grid"
              gridTemplateColumns="64px 1fr"
              gap="12px"
            >
              <Box w="64px" h="80px" borderRadius="10px" bg="aoe.chip" overflow="hidden">
                {thumb && <Image src={thumb} alt="" w="100%" h="100%" objectFit="cover" />}
              </Box>
              <Box minW={0}>
                <Flex justify="space-between" gap="10px" align="flex-start">
                  <Box minW={0}>
                    <Text fontSize="15px" fontWeight="700" lineHeight="1.25" color="aoe.text">
                      {p.name}
                    </Text>
                    <Text
                      fontFamily="mono"
                      fontSize="11px"
                      color="aoe.textMuted"
                      letterSpacing="0.06em"
                      mt="4px"
                      textTransform="uppercase"
                    >
                      {meta}
                    </Text>
                  </Box>
                  <Box
                    as="button"
                    aria-label="Acciones"
                    onClick={() => onOpenMenu(p)}
                    w="36px"
                    h="36px"
                    borderRadius="10px"
                    border="1px solid"
                    borderColor="aoe.borderControl"
                    bg="aoe.chip"
                    color="aoe.textMuted"
                    fontSize="15px"
                    flexShrink={0}
                  >
                    ⋯
                  </Box>
                </Flex>
                <Flex align="center" gap="10px" wrap="wrap" mt="10px">
                  <Text fontSize="15px" fontWeight="800" color="aoe.text">
                    {ars(finalPrice)}
                  </Text>
                  {onSale && (
                    <Text color="aoe.textMuted" fontSize="12px" textDecoration="line-through">
                      {ars(basePrice)}
                    </Text>
                  )}
                  <Box
                    borderRadius="pill"
                    px="9px"
                    py="3px"
                    bg={outOfStock ? "#2a1013" : lowStock ? "#2a2410" : "#0f2018"}
                    color={outOfStock ? "#ff6b76" : lowStock ? "aoe.amber" : "aoe.green"}
                    fontFamily="mono"
                    fontSize="11px"
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                  >
                    {outOfStock ? "Sin stock" : `${stock} u.`}
                  </Box>
                </Flex>
                <Box
                  as="button"
                  onClick={() => onEdit(p)}
                  mt="12px"
                  w="full"
                  h="40px"
                  borderRadius="11px"
                  border="1px solid"
                  borderColor="aoe.borderControl"
                  bg="aoe.chip"
                  color="aoe.text"
                  fontSize="12px"
                  fontWeight="700"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                >
                  Editar
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {filtered.length === 0 && (
        <Box border="1px dashed" borderColor="aoe.borderControl" borderRadius="16px" py={10} px={4} textAlign="center">
          <Text fontFamily="heading" fontSize="22px" textTransform="uppercase" color="aoe.text">
            Nada por acá
          </Text>
          <Text color="aoe.textSubtle" fontSize="14px" mt="8px" mb="18px">
            Probá otro nombre o quitá los filtros.
          </Text>
          <Box
            as="button"
            onClick={() => {
              onQueryChange("");
              onFilterChange("all");
            }}
            h="44px"
            px="20px"
            borderRadius="pill"
            border="none"
            bg="aoe.text"
            color="aoe.bg"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            Limpiar
          </Box>
        </Box>
      )}
    </Box>
  );
}
