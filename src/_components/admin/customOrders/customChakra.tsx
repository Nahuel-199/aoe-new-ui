"use client";

import React from "react";
import {
    Box,
    Button,
    Flex,
    Field,
    Grid,
    Heading,
    IconButton,
    Input,
    NumberInput,
    Textarea,
    VStack,
    Image,
    Spinner,
} from "@chakra-ui/react";
import { useCustomOrderForm } from "@/hooks/useCustomOrderForm";
import { FaPlus, FaTrash } from "react-icons/fa";
import { DeliverySelect } from "./DeleverySelect";

export default function CustomOrderForm() {
    const {
        form,
        updateField,
        addItem,
        removeItem,
        handleUploadItemImages,
        handleUploadDesignRefs,
        handleSubmit,
        isLoading,
        isUploading,
        setForm,
    } = useCustomOrderForm();


    interface OrderItem {
        name: string;
        description: string;
        color: string;
        size: string;
        quantity: number;
        price: number;
        images: Array<{ id: string; url: string }>;
    }

    const handleChangeItem = (
        index: number,
        field: keyof Omit<OrderItem, 'images'>,
        value: OrderItem[keyof Omit<OrderItem, 'images'>]
    ) => {
        const updated = [...form.items];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        updateField("items", updated);
    };

    return (
        <Box maxW="6xl" mx="auto" p={6}>
            <Heading size="lg" mb={6}>
                Crear Pedido Personalizado
            </Heading>

            <VStack gap={6} align="stretch">
                {/* DATOS DEL CLIENTE */}
                <Box>
                    <Heading size="md" mb={3}>
                        Datos del Cliente
                    </Heading>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                        <Field.Root>
                            <Field.Label>Nombre del cliente</Field.Label>
                            <Input
                                value={form.clientName}
                                onChange={(e) => updateField("clientName", e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Teléfono</Field.Label>
                            <Input
                                value={form.phoneNumber}
                                onChange={(e) => updateField("phoneNumber", e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Email</Field.Label>
                            <Input
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                            />
                        </Field.Root>
                    </Grid>
                </Box>

                {/* ITEMS */}
                <Box>
                    <Flex justify="space-between" align="center" mb={3}>
                        <Heading size="md">Ítems del pedido</Heading>
                        <Button
                            onClick={() => addItem()}
                            colorScheme="blue"
                            size="sm"
                        >
                            <FaPlus /> Agregar ítem
                        </Button>
                    </Flex>

                    <VStack gap={6} align="stretch">
                        {form.items.map((item, index) => (
                            <Box key={index} p={4} borderRadius="lg" bg="bg">
                                <Flex justify="space-between" align="center" mb={3}>
                                    <Heading size="sm">Producto #{index + 1}</Heading>
                                    <IconButton
                                        aria-label="Eliminar ítem"
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Flex>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                                    <Field.Root>
                                        <Field.Label>Nombre</Field.Label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) =>
                                                handleChangeItem(index, "name", e.target.value)
                                            }
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Color</Field.Label>
                                        <Input
                                            value={item.color}
                                            onChange={(e) =>
                                                handleChangeItem(index, "color", e.target.value)
                                            }
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Talle</Field.Label>
                                        <Input
                                            value={item.size}
                                            onChange={(e) =>
                                                handleChangeItem(index, "size", e.target.value)
                                            }
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Cantidad</Field.Label>
                                        <NumberInput.Root
                                            value={item.quantity.toString()}
                                            onChange={(val) =>
                                                handleChangeItem(index, "quantity", Number(val))
                                            }
                                            min={1}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Precio</Field.Label>
                                        <NumberInput.Root
                                            value={item.price.toString()}
                                            onChange={(val) =>
                                                handleChangeItem(index, "price", Number(val))
                                            }
                                            min={0}
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    </Field.Root>
                                </Grid>

                                <Field.Root mt={3}>
                                    <Field.Label>Descripción</Field.Label>
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) =>
                                            handleChangeItem(index, "description", e.target.value)
                                        }
                                    />
                                </Field.Root>

                                <Field.Root mt={3}>
                                    <Field.Label>Imágenes</Field.Label>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            e.target.files &&
                                            handleUploadItemImages(index, Array.from(e.target.files))
                                        }
                                    />
                                    {isUploading && <Spinner mt={2} />}
                                    <Flex wrap="wrap" gap={3} mt={2}>
                                        {item.images.map((img, index) => (
                                            <Box key={index} position="relative">
                                                <Image
                                                    src={img.url}
                                                    alt={item.name}
                                                    boxSize="100px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                               
                                            </Box>
                                        ))}
                                    </Flex>
                                </Field.Root>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Box>
                    <Heading size="md" mb={3}>
                        Detalles de Entrega
                    </Heading>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}> 
                            <DeliverySelect
                                value={form.deliveryMethod || ""}
                                onChange={(val) => updateField("deliveryMethod", val)}
                            />
                 

                        <Field.Root>
                            <Field.Label>Dirección de envío</Field.Label>
                            <Input
                                value={form.shippingAddress}
                                onChange={(e) =>
                                    updateField("shippingAddress", e.target.value)
                                }
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Dirección de reunión</Field.Label>
                            <Input
                                value={form.meetingAddress}
                                onChange={(e) =>
                                    updateField("meetingAddress", e.target.value)
                                }
                            />
                        </Field.Root>
                    </Grid>
                </Box>

                {/* TOTALES Y ESTADO */}
                <Box>
                    <Heading size="md" mb={3}>
                        Totales y Estado
                    </Heading>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                        <Field.Root>
                            <Field.Label>Total</Field.Label>
                            <NumberInput.Root
                                value={form.total.toString()}
                                onChange={(val) => updateField("total", Number(val))}
                                min={0}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Monto Pagado</Field.Label>
                            <NumberInput.Root
                                value={form.paidAmount.toString()}
                                onChange={(val) => updateField("paidAmount", Number(val))}
                                min={0}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Monto Restante</Field.Label>
                            <NumberInput.Root
                                value={form.remainingAmount.toString()}
                                onChange={(val) =>
                                    updateField("remainingAmount", Number(val))
                                }
                                min={0}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Costo de envío</Field.Label>
                            <NumberInput.Root
                                value={form.deliveryCost.toString()}
                                onChange={(val) =>
                                    updateField("deliveryCost", Number(val))
                                }
                                min={0}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Field.Root>
                    </Grid>
                </Box>

                {/* NOTAS Y REFERENCIAS */}
                <Box>
                    <Heading size="md" mb={3}>
                        Notas y Referencias
                    </Heading>
                    <Field.Root>
                        <Field.Label>Comentarios</Field.Label>
                        <Textarea
                            value={form.comments}
                            onChange={(e) => updateField("comments", e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root mt={3}>
                        <Field.Label>Notas de diseño</Field.Label>
                        <Textarea
                            value={form.designNotes}
                            onChange={(e) => updateField("designNotes", e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root mt={3}>
                        <Field.Label>Referencias visuales</Field.Label>
                        <Input
                            type="file"
                            multiple
                            onChange={(e) =>
                                e.target.files &&
                                handleUploadDesignRefs(Array.from(e.target.files))
                            }
                        />
                        {isUploading && <Spinner mt={2} />}
                        <Flex wrap="wrap" gap={3} mt={2}>
                            {form.designReferences.map((ref) => (
                                <Image
                                    key={ref.id}
                                    src={ref.url}
                                    alt="Referencia"
                                    boxSize="100px"
                                    objectFit="cover"
                                    borderRadius="md"
                                />
                            ))}
                        </Flex>
                    </Field.Root>
                </Box>

                <Button
                    colorScheme="green"
                    onClick={handleSubmit}
                    loading={isLoading}
                    loadingText="Creando..."
                    size="lg"
                    mt={6}
                >
                    Crear Pedido
                </Button>
            </VStack>
        </Box>
    );
}
