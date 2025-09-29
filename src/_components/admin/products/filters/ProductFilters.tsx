"use client";

import {
  HStack,
  VStack,
  useBreakpointValue,
  Field,
  IconButton,
  Drawer,
  Portal,
  Button,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { LuFilter, LuRotateCcw, LuSearch } from "react-icons/lu";
import { createListCollection } from "@chakra-ui/react";
import { FilterInput } from "./FilterInput";
import { FilterSelect } from "./FilterSelect";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string[];
  onCategoryChange: (value: string[]) => void;
  subcategoryFilter: string[];
  onSubcategoryChange: (value: string[]) => void;
  offerFilter: string[];
  onOfferChange: (value: string[]) => void;
  typeFilter: string[];
  onTypeChange: (value: string[]) => void;
  categories: { _id: string; name: string }[];
  subcategories: { _id: string; name: string }[];
  products: { variants: { type: string }[] }[];
}

export default function ProductFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  subcategoryFilter,
  onSubcategoryChange,
  offerFilter,
  onOfferChange,
  typeFilter,
  onTypeChange,
  categories,
  subcategories,
  products,
}: ProductFiltersProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [open, setOpen] = useState(false);

  const categoryCollection = createListCollection({
    items: categories.map((c) => ({ label: c.name, value: c._id })),
  });

  const subcategoryCollection = createListCollection({
    items: subcategories.map((s) => ({ label: s.name, value: s._id })),
  });

  const uniqueTypes = Array.from(
    new Set(products.flatMap((p) => p.variants.map((v) => v.type)))
  );
  const typeCollection = createListCollection({
    items: [
      { label: "Todos", value: "all" },
      ...uniqueTypes.map((t) => ({ label: t, value: t })),
    ],
  });

  const offerCollection = createListCollection({
    items: [
      { label: "Todos", value: "all" },
      { label: "Sí", value: "yes" },
      { label: "No", value: "no" },
    ],
  });

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryChange([]);
    onSubcategoryChange([]);
    onOfferChange(["all"]);
    onTypeChange(["all"]);
  };

  return isMobile ? (
    <>
      <Flex gap={2}>
        <IconButton
          aria-label="Abrir filtros"
          variant="outline"
          rounded="full"
          onClick={() => setOpen(true)}
        >
          <LuFilter />
        </IconButton>
        <FilterInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          icon={<LuSearch />}
        />
      </Flex>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Filtros</Drawer.Title>
              </Drawer.Header>

              <Drawer.Body>
                <VStack mb={4} gap={4} align="stretch">
                  <VStack gap={3} align="stretch">
                    <FilterSelect
                      collection={categoryCollection}
                      value={categoryFilter}
                      onValueChange={onCategoryChange}
                      placeholder="Filtrar por categoría"
                      width="100%"
                    />
                    <FilterSelect
                      collection={subcategoryCollection}
                      value={subcategoryFilter}
                      onValueChange={onSubcategoryChange}
                      placeholder="Filtrar por subcategoría"
                      width="100%"
                    />
                    <FilterSelect
                      collection={offerCollection}
                      value={offerFilter}
                      onValueChange={onOfferChange}
                      placeholder="Oferta"
                      width="100%"
                    />
                    <FilterSelect
                      collection={typeCollection}
                      value={typeFilter}
                      onValueChange={onTypeChange}
                      placeholder="Tipo"
                      width="100%"
                    />
                  </VStack>
                </VStack>
              </Drawer.Body>

              <Drawer.Footer>
                <Tooltip
                  content="Reiniciar filtros"
                  positioning={{ placement: "top" }}
                >
                  <IconButton
                    aria-label="Reiniciar filtros"
                    variant="outline"
                    rounded="full"
                    onClick={handleResetFilters}
                  >
                    <LuRotateCcw />
                  </IconButton>
                </Tooltip>
                <Button onClick={() => setOpen(false)}>Cerrar</Button>
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  ) : (
    <HStack mb={6} mt={5} gap={4} wrap="wrap" maxW="full">
      <Field.Root orientation="vertical" flex="1" minW="200px" maxW="400px">
        <Field.Label>Filtrar por nombre</Field.Label>
        <FilterInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          icon={<LuSearch />}
        />
      </Field.Root>
      <FilterSelect
        collection={categoryCollection}
        value={categoryFilter}
        onValueChange={onCategoryChange}
        placeholder="Filtrar por categoría"
        width="180px"
      />
      <FilterSelect
        collection={subcategoryCollection}
        value={subcategoryFilter}
        onValueChange={onSubcategoryChange}
        placeholder="Filtrar por subcategoría"
        width="180px"
      />
      <FilterSelect
        collection={offerCollection}
        value={offerFilter}
        onValueChange={onOfferChange}
        placeholder="Oferta"
        width="120px"
      />
      <FilterSelect
        collection={typeCollection}
        value={typeFilter}
        onValueChange={onTypeChange}
        placeholder="Tipo"
        width="150px"
      />
      <Tooltip content="Reiniciar filtros" positioning={{ placement: "top" }}>
        <IconButton
          aria-label="Reiniciar filtros"
          variant="outline"
          rounded="full"
          onClick={handleResetFilters}
          mt={6}
        >
          <LuRotateCcw />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
