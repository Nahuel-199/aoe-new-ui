"use client";

import {
    Input,
    Textarea,
    Select,
    Portal,
    Box,
    Field,
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
        <Box
            p={{ base: 2, md: 4 }}
            w="100%"
            maxW={{ base: "100%", md: "90%" }}
            mx="auto"
        >
            <Field.Root required>
                <Field.Label>
                    Nombre
                </Field.Label>
                <Input
                    placeholder="Nombre del producto"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    mb={4}
                    w="full"
                />
            </Field.Root>
            <Field.Root required>
                <Field.Label>
                    Descripción
                </Field.Label>
                <Textarea
                    placeholder="Descripción"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    required
                    mb={4}
                />
            </Field.Root>
            <Select.Root
                collection={categoryCollection}
                value={form.category}
                onValueChange={(e) => onCategoryChange(e.value)}
                mb={4}
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
                <Portal>
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
                </Portal>
            </Select.Root>

            <Select.Root
                collection={subcategoryCollection}
                value={form.subcategories}
                onValueChange={(e) => onSubcategoriesChange(e.value)}
                mb={4}
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
                <Portal>
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
                </Portal>
            </Select.Root>
        </Box>
    );
}
