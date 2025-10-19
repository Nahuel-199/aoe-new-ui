"use client";

import {
    Box,
    Button,
    ButtonGroup,
    Steps,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
        isUploadingImage,
    } = formHook;

    const [step, setStep] = useState(0);

    useEffect(() => {
        if (form.variants.length === 0) addVariant();
    }, [form.variants.length, addVariant]);

    const steps = [
        { title: "Datos del producto" },
        { title: "Variantes" },
    ];

    return (
        <Box
            p={6}
            maxW="1200px"
            mx="auto"
            borderWidth="1px"
            rounded="lg"
            shadow="md"
        >
            <Steps.Root
                step={step}
                onStepChange={(e) => setStep(e.step)}
                count={steps.length}
            >
                <Steps.List mb={6}>
                    {steps.map((s, index) => (
                        <Steps.Item key={index} index={index} title={s.title}>
                            <Steps.Indicator />
                            <Steps.Title>{s.title}</Steps.Title>
                            <Steps.Separator />
                        </Steps.Item>
                    ))}
                </Steps.List>

                <Steps.Content index={0}>
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                        <GridItem colSpan={2}>
                            <ProductFormFields
                                form={form}
                                categories={categories}
                                subcategories={subcategories}
                                onChange={handleChange}
                                onCategoryChange={handleCategory}
                                onSubcategoriesChange={handleSubcategories}
                            />
                        </GridItem>
                    </Grid>
                </Steps.Content>

                <Steps.Content index={1}>
                    <Box
                        w="full"
                        maxW={{ base: "90%", md: "100%" }}
                        maxH={{ base: "400px", md: "350px" }}
                        overflowY="auto"
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
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
                                isUploadingImage={isUploadingImage}
                            />
                        ))}

                        <Button
                            mt={4}
                            colorScheme="teal"
                            variant="outline"
                            onClick={addVariant}
                        >
                            + Agregar otra variante
                        </Button>
                    </Box>

                    <Button
                        mt={6}
                        colorPalette="red"
                        onClick={handleSubmit}
                        loading={isLoading}
                        loadingText={mode === "edit" ? "Actualizando..." : "Creando..."}
                        w={{ base: "full", md: "30%" }}
                    >
                        {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
                    </Button>
                </Steps.Content>

                <Steps.CompletedContent>
                    ¡Producto completado!
                </Steps.CompletedContent>

                <ButtonGroup size="sm" variant="outline" mt={8}>
                    <Steps.PrevTrigger asChild>
                        <Button disabled={step === 0}>Anterior</Button>
                    </Steps.PrevTrigger>
                    <Steps.NextTrigger asChild>
                        <Button disabled={step === steps.length}>Siguiente</Button>
                    </Steps.NextTrigger>
                </ButtonGroup>
            </Steps.Root>
        </Box>
    );
}