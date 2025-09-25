'use client';

import { Box, VStack, HStack, Text, Image, IconButton, Flex } from "@chakra-ui/react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { VariantDialog } from "./variants/VariantDialog";
import { Product } from "@/types/product.types";

interface ResponsiveProductCardsProps {
    products: Product[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const CardProducts = ({ products, onEdit, onDelete }: ResponsiveProductCardsProps) => {
    return (
        <VStack gap={4} mt={4} align="stretch">
            {products.map((product) => (
                <Box key={product._id} p={4} borderWidth="1px" borderRadius="md" shadow="sm">
                    <HStack justify="space-between" align="start">
                        <VStack align="start" gap={4}>
                            <Text fontWeight="bold">{product.name}</Text>
                            <Text>Precio: ${product.price}</Text>
                            <Text>Oferta: {product.is_offer ? "Sí" : "No"}</Text>
                            {product.price_offer && <Text>Precio oferta: ${product.price_offer}</Text>}
                            <Text>Categoría: {product.category?.name}</Text>
                            <Text>Subcategorías: {product.subcategories.map(s => s.name).join(", ")}</Text>
                            <Text>Tipo: {product.type}</Text>
                            <VariantDialog variants={product.variants} />
                        </VStack>
                        <Flex gap={2} align="center">
                            <IconButton aria-label="Editar" size="sm" colorPalette="blue" variant={"outline"} onClick={() => onEdit(product._id)}>
                                <FiEdit />
                            </IconButton>
                            <IconButton aria-label="Borrar" size="sm" colorPalette="red"  variant={"outline"}onClick={() => onDelete(product._id)}>
                                <FiTrash />
                            </IconButton>
                        </Flex>
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
};
