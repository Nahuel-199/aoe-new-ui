'use client';

import { Variant } from "@/types/product.types";
import {
    Badge,
    Box,
    Button,
    CloseButton,
    DataList,
    Dialog,
    Flex,
    Image,
    Portal,
    SimpleGrid,
    VStack,
} from "@chakra-ui/react";


interface VariantDialogProps {
    variants: Variant[];
}

export const VariantDialog = ({ variants }: VariantDialogProps) => {
    return (
        <VStack alignItems="center">
            <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
                <Dialog.Trigger asChild>
                    <Button size="sm" variant="outline" colorPalette={{ base: "red", md: "" }}>
                        Ver variantes
                    </Button>
                </Dialog.Trigger>

                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            maxW="90vw"
                            maxH="90vh"
                            overflow="hidden"
                            display="flex"
                            flexDirection="column"
                        >
                            <Dialog.Header>
                                <Dialog.Title>Variantes del producto</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body
                                pb={4}
                                flex="1"
                                overflowY="auto"
                            >
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                    {variants.map((variant, index) => (
                                        <Box
                                            key={index}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            p={4}
                                            boxShadow="sm"
                                            w="full"
                                        >
                                            <DataList.Root key={index} orientation="vertical" mb={4}>
                                                <DataList.Item>
                                                    <DataList.ItemLabel>Color</DataList.ItemLabel>
                                                    <DataList.ItemValue>
                                                        <Badge colorPalette="red">{variant.color}</Badge>
                                                    </DataList.ItemValue>
                                                </DataList.Item>

                                                <DataList.Item>
                                                    <DataList.ItemLabel>Talles</DataList.ItemLabel>
                                                    <DataList.ItemValue>
                                                        {variant.sizes.map((s) => `${s.size} (${s.stock})`).join(", ")}
                                                    </DataList.ItemValue>
                                                </DataList.Item>

                                                <DataList.Item>
                                                    <DataList.ItemLabel>Imágenes</DataList.ItemLabel>
                                                    <DataList.ItemValue>
                                                        <Flex wrap="wrap" gap={2} justify="flex-start">
                                                            {variant.images.map((img) => (
                                                                <Image
                                                                    src={img.url}
                                                                    key={img.id}
                                                                    alt={variant.color}
                                                                    boxSize={{ base: "80px", sm: "100px", md: "120px" }}
                                                                    maxW="100%"
                                                                    objectFit="cover"
                                                                    borderRadius="md"
                                                                    _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                                                                />
                                                            ))}
                                                        </Flex>
                                                    </DataList.ItemValue>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </Dialog.Body>

                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" position="absolute" top="4" right="4" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </VStack>
    );
};
