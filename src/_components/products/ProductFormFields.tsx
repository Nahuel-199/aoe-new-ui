"use client";

import {
    Input,
    Textarea,
    NumberInput,
    Select,
    Portal,
    Box,
    Field,
    RadioGroup,
    HStack,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";

interface Category {
    _id: string;
    name: string;
    types: string[];
}

interface Subcategory {
    _id: string;
    name: string;
}

interface ProductFormFieldsProps {
    form: {
        name: string;
        description: string;
        price: string;
        is_offer: boolean;
        price_offer?: string;
        category: string[];
        subcategories: string[];
        type: string;
    };
    categories: Category[];
    subcategories: Subcategory[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onPriceChange: (value: string) => void;
    onCategoryChange: (value: string[]) => void;
    onSubcategoriesChange: (value: string[]) => void;
    onTypeChange: (value: string[]) => void;
    onOfferChange: (value: boolean) => void;
}

export default function ProductFormFields({
    form,
    categories,
    subcategories,
    onChange,
    onPriceChange,
    onCategoryChange,
    onSubcategoriesChange,
    onTypeChange,
    onOfferChange,
}: ProductFormFieldsProps) {
    const categoryCollection = createListCollection({
        items: categories.map((c) => ({ label: c.name, value: c._id })),
    });

    const subcategoryCollection = createListCollection({
        items: subcategories.map((s) => ({ label: s.name, value: s._id })),
    });

    const typeCollection = createListCollection({
        items:
            categories
                .find((c) => c._id === form.category[0])
                ?.types.map((t) => ({ label: t, value: t })) || [],
    });

    return (
        <Box p={4} w="full" maxW={{base: "95%", md: "100%"}}>
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
            <Field.Root required>
                <Field.Label>
                    Precio
                </Field.Label>
                <NumberInput.Root
                    min={0}
                    value={form.price}
                    onValueChange={(e) => onPriceChange(e.value)}
                    w={"full"}
                    mb={4}
                >
                    <NumberInput.Control />
                    <NumberInput.Input placeholder="Precio" name="price" />
                </NumberInput.Root>
            </Field.Root>

            <Field.Root>
                <Field.Label>¿Está en oferta?</Field.Label>
                <RadioGroup.Root
                    value={form.is_offer ? "yes" : "no"}
                    onValueChange={(e) => onOfferChange(e.value === "yes")}
                    mb={4}
                >
                    <HStack gap="6">
                        <RadioGroup.Item value="yes">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>Sí</RadioGroup.ItemText>
                        </RadioGroup.Item>
                        <RadioGroup.Item value="no">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>No</RadioGroup.ItemText>
                        </RadioGroup.Item>
                    </HStack>
                </RadioGroup.Root>
            </Field.Root>

            {form.is_offer && (
                <Field.Root>
                    <Field.Label>Precio de oferta</Field.Label>
                    <NumberInput.Root
                        min={0}
                        value={form.price_offer || ""}
                        onValueChange={(e) =>
                            onChange({
                                target: { name: "price_offer", value: e.value },
                            } as React.ChangeEvent<HTMLInputElement>)
                        }
                        w={"full"}
                        mb={4}
                    >
                        <NumberInput.Control />
                        <NumberInput.Input
                            placeholder="Precio de oferta"
                            name="price_offer"
                        />
                    </NumberInput.Root>
                </Field.Root>
            )}

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

            {form.category.length > 0 && (
                <Select.Root
                    collection={typeCollection}
                    value={form.type ? [form.type] : []}
                    onValueChange={(e) => onTypeChange(e.value)}
                    mt={4}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Tipo</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Selecciona tipo de categoria" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {typeCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            )}
        </Box>
    );
}
