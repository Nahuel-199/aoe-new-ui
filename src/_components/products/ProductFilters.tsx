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
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

interface ProductFiltersProps {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  search: string;
  onCategoryChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  search,
  onCategoryChange,
  onSubcategoryChange,
  onSearchChange,
  onClearFilters,
}: ProductFiltersProps) {
  const categoriesCollection = createListCollection({
    items: categories.map((c) => ({
      label: c.name,
      value: c._id,
    })),
  });

  const subcategoriesCollection = createListCollection({
    items: subcategories.map((s) => ({
      label: s.name,
      value: s._id,
    })),
  });

  return (
    <Box mb={6}>
      <Stack direction={{ base: "column", md: "row" }} gap={4}>
        <InputGroup flex="1" startElement={<LuSearch />}>
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            rounded={"full"}
          />
        </InputGroup>

        <Select.Root
          collection={categoriesCollection}
          value={selectedCategory ? [selectedCategory] : []}
          onValueChange={(e) => onCategoryChange(e.value[0] ?? "")}
          width="220px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Categoría" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {categoriesCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Select.Root
          collection={subcategoriesCollection}
          value={selectedSubcategory ? [selectedSubcategory] : []}
          onValueChange={(e) => onSubcategoryChange(e.value[0] ?? "")}
          width="220px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Subcategoría" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {subcategoriesCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Button variant="outline" onClick={onClearFilters}>
          Limpiar
        </Button>
      </Stack>
    </Box>
  );
}
