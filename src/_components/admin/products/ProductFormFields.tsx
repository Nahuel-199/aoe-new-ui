"use client";

import {
    Input,
    Textarea,
    Select,
    Portal,
    Box,
    Field,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";

interface Category {
    _id: string;
    name: string;
}

interface Subcategory {
    _id: string;
    name: string;
}

interface ProductFormFieldsProps {
    form: {
        name: string;
        description: string;
        category: string[];
        subcategories: string[];
    };
    categories: Category[];
    subcategories: Subcategory[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCategoryChange: (value: string[]) => void;
    onSubcategoriesChange: (value: string[]) => void;
}

export default function ProductFormFields({
    form,
    categories,
    subcategories,
    onChange,
    onCategoryChange,
    onSubcategoriesChange,
}: ProductFormFieldsProps) {
    const categoryCollection = createListCollection({
        items: categories.map((c) => ({ label: c.name, value: c._id })),
    });

    const subcategoryCollection = createListCollection({
        items: subcategories.map((s) => ({ label: s.name, value: s._id })),
    });

    return (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
                <Field.Root required>
                    <Field.Label>Nombre del Producto</Field.Label>
                    <Input
                        placeholder="Ej: Remera básica"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        size="lg"
                    />
                </Field.Root>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
                <Field.Root required>
                    <Field.Label>Descripción</Field.Label>
                    <Textarea
                        placeholder="Describe las características del producto..."
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        required
                        rows={4}
                    />
                </Field.Root>
            </GridItem>

            <GridItem>
                <Select.Root
                    collection={categoryCollection}
                    value={form.category}
                    onValueChange={(e) => onCategoryChange(e.value)}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Categoría</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecciona una categoría" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    
                        <Select.Positioner>
                            <Select.Content>
                                {categoryCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    
                </Select.Root>
            </GridItem>

            <GridItem>
                <Select.Root
                    collection={subcategoryCollection}
                    value={form.subcategories}
                    onValueChange={(e) => onSubcategoriesChange(e.value)}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Subcategorías</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecciona subcategorías" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    
                        <Select.Positioner>
                            <Select.Content>
                                {subcategoryCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                
                </Select.Root>
            </GridItem>
        </Grid>
    );
}
