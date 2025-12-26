"use client";

import {
    Box,
    Button,
    Heading,
    VStack,
    Accordion,
    HStack,
    Badge,
    Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import ProductFormFields from "./ProductFormFields";
import { VariantForm } from "./variants/VariantForm";
import { useNewProductForm } from "@/hooks/useNewProductForm";
import { useEditProductForm } from "@/hooks/useEditProductForm";
import { Category, Product, Subcategory } from "@/types/product.types";
import { FiPlus } from "react-icons/fi";

interface ProductFormContainerProps {
    mode: "create" | "edit";
    categories: Category[];
    subcategories: Subcategory[];
    product?: Product;
    onClose?: () => void;
}

export default function ProductFormContainer({
    mode,
    categories,
    subcategories,
    product,
    onClose,
}: ProductFormContainerProps) {
    const formHook =
        mode === "create" ? useNewProductForm(onClose) : useEditProductForm(product!, onClose);

    const {
        form,
        handleChange,
        handleCategory,
        handleSubcategories,
        addVariant,
        removeVariant,
        updateVariant,
        addSizeToVariant,
        removeSizeFromVariant,
        handleUploadImage,
        handleRemoveImage,
        handleSubmit,
        isLoading,
        isUploadingImage,
    } = formHook;

    useEffect(() => {
        if (form.variants.length === 0) addVariant();
    }, [form.variants.length, addVariant]);

    return (
        <VStack gap={6} align="stretch" p={{ base: 4, md: 6 }} maxW="1400px" mx="auto">
            {/* Header */}
            <Box>
                <Heading size={{ base: "lg", md: "xl" }} mb={2}>
                    {mode === "create" ? "Crear Producto" : "Editar Producto"}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                    Complete la información básica y las variantes del producto
                </Text>
            </Box>

            {/* Información Básica */}
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 4, md: 6 }}
                bg="bg.subtle"
            >
                <Heading size="md" mb={4}>Información Básica</Heading>
                <ProductFormFields
                    form={form}
                    categories={categories}
                    subcategories={subcategories}
                    onChange={handleChange}
                    onCategoryChange={handleCategory}
                    onSubcategoriesChange={handleSubcategories}
                />
            </Box>

            {/* Variantes */}
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 4, md: 6 }}
                bg="bg.subtle"
            >
                <HStack justify="space-between" mb={4}>
                    <Heading size="md">Variantes</Heading>
                    <Button
                        size="sm"
                        colorPalette="teal"
                        variant="outline"
                        onClick={addVariant}
                    >
                        <FiPlus /> Agregar Variante
                    </Button>
                </HStack>

                <Accordion.Root collapsible defaultValue={["0"]} multiple>
                    {form.variants.map((variant, index) => (
                        <Accordion.Item key={index} value={index.toString()}>
                            <Accordion.ItemTrigger>
                                <HStack flex="1" justify="space-between" pr={4}>
                                    <Text fontWeight="medium">
                                        Variante #{index + 1}
                                    </Text>
                                    <HStack gap={2}>
                                        {variant.type && (
                                            <Badge colorPalette="blue" size="sm">
                                                {variant.type}
                                            </Badge>
                                        )}
                                        {variant.color && (
                                            <Badge colorPalette="purple" size="sm">
                                                {variant.color}
                                            </Badge>
                                        )}
                                        {variant.price && (
                                            <Badge colorPalette="green" size="sm">
                                                ${variant.price}
                                            </Badge>
                                        )}
                                    </HStack>
                                </HStack>
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Box pt={4}>
                                    <VariantForm
                                        variant={variant}
                                        index={index}
                                        updateVariant={updateVariant}
                                        removeVariant={removeVariant}
                                        addSizeToVariant={addSizeToVariant}
                                        removeSizeFromVariant={removeSizeFromVariant}
                                        handleUploadImage={handleUploadImage}
                                        handleRemoveImage={handleRemoveImage}
                                        isUploadingImage={isUploadingImage}
                                        totalVariants={form.variants.length}
                                    />
                                </Box>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Box>

            {/* Submit Button */}
            <HStack justify="flex-end" pt={4}>
                <Button
                    colorPalette="red"
                    onClick={handleSubmit}
                    loading={isLoading}
                    loadingText={mode === "edit" ? "Actualizando..." : "Creando..."}
                    size="lg"
                    px={8}
                >
                    {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
                </Button>
            </HStack>
        </VStack>
    );
}