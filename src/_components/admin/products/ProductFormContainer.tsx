'use client';

import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import ProductFormFields from "./ProductFormFields";
import { VariantForm } from "./variants/VariantForm";
import { useNewProductForm } from "@/hooks/useNewProductForm";
import { useEditProductForm } from "@/hooks/useEditProductForm";
import { Category, Product, Subcategory } from "@/types/product.types";

interface ProductFormContainerProps {
    mode: "create" | "edit";
    categories: Category[];
    subcategories: Subcategory[];
    product?: Product;
}

export default function ProductFormContainer({
    mode,
    categories,
    subcategories,
    product,
}: ProductFormContainerProps) {
    const formHook =
        mode === "create" ? useNewProductForm() : useEditProductForm(product!);

    const {
        form,
        handleChange,
        handleCategory,
        handleSubcategories,
        addVariant,
        updateVariant,
        addSizeToVariant,
        handleUploadImage,
        handleRemoveImage,
        handleSubmit,
        isLoading,
    } = formHook;

    return (
        <Box
            p={6}
            maxW="1200px"
            mx="auto"
            borderWidth="1px"
            rounded="lg"
            shadow="md"
        >
            <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={8}
                alignItems="start"
            >
                <GridItem w="full" maxW="100%">
                    <ProductFormFields
                        form={form}
                        categories={categories}
                        subcategories={subcategories}
                        onChange={handleChange}
                        onCategoryChange={handleCategory}
                        onSubcategoriesChange={handleSubcategories}
                    />
                    <Box display={"flex"} flexDir={"row"}>
                        <Button colorScheme="teal" onClick={handleSubmit} loading={isLoading} loadingText={mode === "edit" ? "Actualizando..." : "Creando..."} display={{ base: "none", md: "inherit" }}>
                            {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
                        </Button>
                        <Button
                            colorPalette="red"
                            onClick={addVariant}
                            mb={4}
                            ml={4}
                        >
                            + Agregar Variante
                        </Button>
                    </Box>
                </GridItem>

                <GridItem w="full" maxW="100%">
                    <Box
                        w="full"
                        maxW={{ base: "90%", md: "100%" }}
                        maxH={{ base: "300px", md: "530px" }}
                        overflowY="auto"
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        {form.variants.map((variant, index) => (
                            <VariantForm
                                key={index}
                                variant={variant}
                                index={index}
                                updateVariant={updateVariant}
                                addSizeToVariant={addSizeToVariant}
                                handleUploadImage={handleUploadImage}
                                handleRemoveImage={handleRemoveImage}
                            />
                        ))}
                    </Box>
                </GridItem>
            </Grid>
            <Button colorPalette="red" variant={"outline"} onClick={handleSubmit} loading={isLoading} loadingText={mode === "edit" ? "Actualizando..." : "Creando..."} display={{ base: "block", md: "none" }} mt={4} w="full">
                {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
            </Button>
        </Box>
    );
}
