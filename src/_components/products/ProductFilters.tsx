"use client";

import React from "react";
import { Category, Subcategory } from "@/types/product.types";
import {
  Box,
  Stack,
  Input,
  Button,
  Portal,
  Select,
  createListCollection,
  InputGroup,
  Flex,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export type SortOption = "relevancia" | "menor" | "mayor";

interface ProductFiltersProps {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  search: string;
  sort: SortOption;
  onCategoryChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClearFilters: () => void;
}

const selectTriggerProps = {
  bg: "aoe.field",
  borderColor: "aoe.borderControl",
  color: "aoe.text",
  borderRadius: "8px",
  _hover: { borderColor: "aoe.borderHover" },
};

export default function ProductFilters({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  search,
  sort,
  onCategoryChange,
  onSubcategoryChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) {
  const subcategoriesCollection = createListCollection({
    items: subcategories.map((s) => ({
      label: s.name,
      value: s._id,
    })),
  });

  const sortCollection = createListCollection({
    items: [
      { label: "Ordenar: relevancia", value: "relevancia" },
      { label: "Precio: menor a mayor", value: "menor" },
      { label: "Precio: mayor a menor", value: "mayor" },
    ],
  });

  const chips = [{ _id: "", name: "Todo" }, { _id: "offers", name: "Ofertas" }, ...categories];

  return (
    <Box mb={6}>
      <InputGroup flex="1" startElement={<LuSearch color="var(--chakra-colors-aoe-textFaint)" />} mb={4}>
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          borderRadius="pill"
          bg="aoe.field"
          borderColor="aoe.borderControl"
          color="aoe.text"
          _placeholder={{ color: "aoe.textFaint" }}
          _hover={{ borderColor: "aoe.borderHover" }}
          _focusVisible={{ borderColor: "aoe.red" }}
        />
      </InputGroup>

      <Flex gap="10px" overflowX="auto" pb="14px" mb={2}>
        {chips.map((c) => {
          const active = selectedCategory === c._id;
          return (
            <Button
              key={c._id || "all"}
              onClick={() => onCategoryChange(c._id)}
              flex="none"
              h="38px"
              px="16px"
              borderRadius="pill"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg={active ? "aoe.red" : "aoe.chip"}
              color={active ? "white" : "aoe.textMuted"}
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.06em"
              textTransform="uppercase"
              _hover={{ color: active ? "white" : "aoe.text" }}
            >
              {c.name}
            </Button>
          );
        })}
      </Flex>

      <Stack
        direction={{ base: "column", md: "row" }}
        gap={3}
        align={{ md: "center" }}
        borderTop="1px solid"
        borderColor="aoe.borderSubtle"
        pt={4}
      >
        <Select.Root
          collection={subcategoriesCollection}
          value={selectedSubcategory ? [selectedSubcategory] : []}
          onValueChange={(e) => onSubcategoryChange(e.value[0] ?? "")}
          width={{ base: "full", md: "220px" }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger {...selectTriggerProps}>
              <Select.ValueText placeholder="Subcategoría" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator color="aoe.textFaint" />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content bg="aoe.bgAlt" borderColor="aoe.borderSubtle" color="aoe.text">
                {subcategoriesCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item} _hover={{ bg: "aoe.surface" }}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Box flex={1} display={{ base: "none", md: "block" }} />

        <Select.Root
          collection={sortCollection}
          value={[sort]}
          onValueChange={(e) => onSortChange((e.value[0] as SortOption) ?? "relevancia")}
          width={{ base: "full", md: "220px" }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger {...selectTriggerProps} fontFamily="mono" fontSize="11px">
              <Select.ValueText placeholder="Ordenar" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator color="aoe.textFaint" />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content bg="aoe.bgAlt" borderColor="aoe.borderSubtle" color="aoe.text">
                {sortCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item} _hover={{ bg: "aoe.surface" }} fontFamily="mono" fontSize="11px">
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Button
          variant="outline"
          onClick={onClearFilters}
          borderColor="aoe.borderControl"
          color="aoe.text"
          borderRadius="pill"
          _hover={{ borderColor: "aoe.text" }}
        >
          Limpiar
        </Button>
      </Stack>
    </Box>
  );
}
