"use client";

import React, { useState } from "react";
import { Order } from "@/types/order.types";
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Textarea,
    Select,
    Button,
    Image,
    Separator,
    Badge,
    createListCollection,
    Portal,
} from "@chakra-ui/react";
import { updateOrderAdmin } from "@/lib/actions/order.actions";

interface OrderProps {
    orders: Order[];
}

export default function OrderById({ orders }: OrderProps) {
    const [form, setForm] = useState({
        comments: orders.comments || "",
        paymentMethod: orders.paymentMethod || "",
        paidAmount: orders.paidAmount || 0,
        remainingAmount: orders.remainingAmount || 0,
        phoneNumber: orders.phoneNumber || "",
        deliveryMethod: orders.deliveryMethod || "",
        meetingAddress: orders.meetingAddress || "",
    });

    const deliveryCollection = createListCollection({
        items: [
            { label: "Correo", value: "correo" },
            { label: "Punto de encuentro", value: "punto_encuentro" },
        ],
    });

    const paymentCollection = createListCollection({
        items: [
            { label: "Efectivo", value: "efectivo" },
            { label: "Transferencia", value: "transferencia" },
            { label: "Otro", value: "otro" },
        ],
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await updateOrderAdmin(orders._id, form);
            alert("Orden actualizada correctamente!");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar la orden");
        }
    };

    return (
        <Box p={6} maxW="800px" mx="auto">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
                Orden #{orders._id}
            </Text>

            <Box mb={4}>
                <Text fontWeight="bold">Usuario:</Text>
                <Text>
                    {orders.user.name} ({orders.user.email})
                </Text>
                {orders.phoneNumber && <Text>Teléfono: {orders.phoneNumber}</Text>}
            </Box>

            <Separator mb={4} />

            <VStack align="stretch" gap={3}>
                <Text fontWeight="bold">Productos:</Text>
                {orders.items.map((item) => (
                    <HStack key={item.product._id} gap={3}>
                        {item.variant.imageUrl && (
                            <Image
                                src={item.variant.imageUrl}
                                alt={item.product.name}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                        )}
                        <VStack align="start">
                            <Text fontWeight="medium">{item.product.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                                {item.variant.type}, {item.variant.color}, {item.variant.size} ×{" "}
                                {item.variant.quantity}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Precio: ${item.variant.price}
                            </Text>
                        </VStack>
                    </HStack>
                ))}
            </VStack>

            <Separator my={4} />

            <HStack justify="space-between">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold" color="red.500">
                    ${orders.total}
                </Text>
            </HStack>

            <Separator my={4} />

            <VStack align="stretch" gap={3}>
                <Text fontWeight="bold">Estado:</Text>

                <Text fontWeight="bold">Comentarios:</Text>
                <Textarea
                    value={form.comments}
                    onChange={(e) => handleChange("comments", e.target.value)}
                />

                <Text fontWeight="bold">Método de pago:</Text>
                <Input
                    value={form.paymentMethod}
                    onChange={(e) => handleChange("paymentMethod", e.target.value)}
                    placeholder="Efectivo, transferencia, etc."
                />

                <HStack gap={4}>
                    <Box>
                        <Text fontWeight="bold">Pagado:</Text>
                        <Input
                            type="number"
                            value={form.paidAmount}
                            onChange={(e) =>
                                handleChange("paidAmount", Number(e.target.value))
                            }
                        />
                    </Box>
                    <Box>
                        <Text fontWeight="bold">Restante:</Text>
                        <Input
                            type="number"
                            value={form.remainingAmount}
                            onChange={(e) =>
                                handleChange("remainingAmount", Number(e.target.value))
                            }
                        />
                    </Box>
                </HStack>

                <Text fontWeight="bold">Número de teléfono:</Text>
                <Input
                    value={form.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />

                <Text fontWeight="bold">Método de envío:</Text>
                <Select.Root
                    collection={deliveryCollection}
                    value={form.deliveryMethod ? [form.deliveryMethod] : []}
                    onValueChange={(val) => handleChange("deliveryMethod", val.value)}
                    width="200px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Método de envío" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {deliveryCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    collection={paymentCollection}
                    value={form.paymentMethod ? [form.paymentMethod] : []}
                    onValueChange={(val) => handleChange("paymentMethod", val.value)}
                    width="200px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Metodo de pago" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {paymentCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                {form.deliveryMethod === "punto_encuentro" && (
                    <>
                        <Text fontWeight="bold">Dirección del punto de encuentro:</Text>
                        <Input
                            value={form.meetingAddress}
                            onChange={(e) => handleChange("meetingAddress", e.target.value)}
                        />
                    </>
                )}

                <Button colorScheme="blue" onClick={handleSave}>
                    Guardar cambios
                </Button>
            </VStack>
        </Box>
    );
}
