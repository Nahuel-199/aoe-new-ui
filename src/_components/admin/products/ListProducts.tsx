"use client";

import React, { useMemo, useState, useTransition } from "react";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Table,
  useBreakpointValue,
} from "@chakra-ui/react";
import { VariantDialog } from "./variants/VariantDialog";
import { Category, Product, Subcategory } from "@/types/product.types";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import ProductFilters from "./filters/ProductFilters";
import { CardProducts } from "./CardProducts";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { deleteProduct } from "@/lib/actions/product.actions";

interface ListProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
}

export default function ListProducts({
  products,
  categories,
  subcategories,
}: ListProductsProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string[]>([]);
  const [offerFilter, setOfferFilter] = useState<string[]>(["all"]);
  const [typeFilter, setTypeFilter] = useState<string[]>(["all"]);
  const [isPending, startTransition] = useTransition();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter.length
        ? categoryFilter.includes(p.category._id)
        : true;

      const matchesSubcategory = subcategoryFilter.length
        ? p.subcategories.some((sub) => subcategoryFilter.includes(sub._id))
        : true;

      const matchesOffer = offerFilter.includes("all")
        ? true
        : p.variants.some((v) =>
            offerFilter.includes("yes") ? v.is_offer : !v.is_offer
          );

      const matchesType = typeFilter.includes("all")
        ? true
        : p.variants.some((v) => typeFilter.includes(v.type));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesOffer &&
        matchesType
      );
    });
  }, [
    search,
    categoryFilter,
    subcategoryFilter,
    offerFilter,
    typeFilter,
    products,
  ]);

  const handleEdit = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toaster.success({
          title: "Producto eliminado",
        });
        router.refresh();
      } catch (error) {
        toaster.error({
          title: "Error al eliminar",
          description: (error as Error).message,
        });
      }
    });
  };

  return (
    <Box p={6}>
      <Flex mb={6}>
        <IconButton
          aria-label="Agregar producto"
          variant="outline"
          colorPalette="red"
          onClick={() => router.push("/admin/products/new")}
          size={"sm"}
          rounded={"full"}
        >
          <FiPlus />
        </IconButton>
        <Heading size="2xl" ml={2}>
          Productos
        </Heading>
      </Flex>
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        onSubcategoryChange={setSubcategoryFilter}
        offerFilter={offerFilter}
        onOfferChange={setOfferFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categories={categories}
        subcategories={subcategories}
        products={products}
      />
      {isMobile ? (
        <CardProducts
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign={"center"}>
                Nombre
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Categoría
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Subcategorías
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Tipos
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Oferta
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Variantes
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Acciones
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredProducts.map((product) => (
              <Table.Row key={product._id}>
                <Table.Cell fontWeight="medium" textAlign={"center"}>
                  {product.name}
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  {product.category?.name}
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  {product.subcategories.map((sub) => sub.name).join(", ")}
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  {Array.from(
                    new Set(product.variants.map((v) => v.type))
                  ).join(", ")}
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  {product.variants.some((v) => v.is_offer) ? (
                    <Badge colorPalette="red">Sí</Badge>
                  ) : (
                    <Badge colorPalette="gray">No</Badge>
                  )}
                </Table.Cell>
                <Table.Cell textAlign={"center"}>
                  <VariantDialog variants={product.variants} />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <HStack justify="center" gap={2}>
                    <IconButton
                      aria-label="Editar producto"
                      size="sm"
                      colorPalette="blue"
                      loading={isPending}
                      variant={"outline"}
                      onClick={() => handleEdit(product._id)}
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Borrar producto"
                      size="sm"
                      colorPalette="red"
                      variant={"outline"}
                      onClick={() => handleDelete(product._id)}
                    >
                      <FiTrash />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
