"use client";

import { useCart } from "@/context/CartContext";
import {
    Box,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Separator,
    IconButton,
    Badge,
    Image,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order.actions";
import { useSession } from "next-auth/react";
import { showToast } from "nextjs-toast-notify";

export default function CartSection() {
    const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    console.log("CARRITO", cart)

    const total = cart.reduce(
        (acc, item) => acc + item.variant.price * item.quantity,
        0
    );

    const handleCreateOrder = async () => {
        try {
            setLoading(true);

            const items = cart.map((item) => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                variant: {
                    type: item.variant.type,
                    color: item.variant.color,
                    size: item.variant.size,
                    price: item.variant.price,
                    imageUrl: item.variant.imageUrl,
                },
            }));
            console.log("ITEMS", items)

            const order = await createOrder({
                items,
            });

            console.log("CREATED ORDER", order);

            showToast.success("¡Orden de compra creada exitósamente!", {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "bounceIn",
                icon: '',
                sound: true,
            });
            clearCart();
            // router.push(`/mis-pedidos/${order._id}`);
        } catch (error) {
            showToast.error("Error creando la orden de compra", {
                duration: 4000,
                progress: true,
                position: "top-center",
                transition: "bounceIn",
                icon: '',
                sound: true,
            });
            console.error("Error creando orden:", error);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <Box textAlign="center" mt={8} mb={6}>
                <Text fontWeight="bold" textTransform="uppercase">
                    Tu carrito está vacío.
                </Text>
                <Image
                    src="/nocart.png"
                    alt="aoe-indumentaria"
                    w={{ base: "40%", lg: "22%" }}
                    mx="auto"
                />
            </Box>
        );
    }

    return (
        <Box maxW="800px" mx="auto" p={4}>
            <VStack align="stretch">
                <Text
                    fontSize={{ base: "15px", md: "2xl" }}
                    fontWeight="bold"
                    color="red.500"
                    textAlign="center"
                    mb={4}
                >
                    Carrito
                    <Text
                        as="span"
                        display={{ base: "inline", md: "inline" }}
                        fontSize={{ base: "15px", md: "2xl" }}
                        ml={2}
                        mb={4}
                        color={"black"}
                        _dark={{ color: "white" }}
                    >
                        de compras
                    </Text>
                </Text>

                {cart.map((item, idx) => (
                    <Box
                        key={idx}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <HStack justify="space-between" align="center">
                            <HStack gap={4}>
                                <img
                                    src={item.variant.imageUrl}
                                    alt={item.name}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <VStack align="start" gap={1}>
                                    <Text fontWeight="bold">{item.name}</Text>
                                    <HStack gap={2}>
                                        <Badge>{item.variant.type}</Badge>
                                        <Badge>{item.variant.color}</Badge>
                                        <Badge>{item.variant.size}</Badge>
                                    </HStack>
                                    {item.category && (
                                        <Text fontSize="sm" color="gray.500">
                                            {item.category}
                                        </Text>
                                    )}
                                    <Text>
                                        ${item.variant.price} x {item.quantity} = $
                                        {item.variant.price * item.quantity}
                                    </Text>

                                </VStack>
                            </HStack>
                            <HStack align="center" gap={2}>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        decreaseQuantity(item.productId, `${item.productId}-${item.variant.size}`)
                                    }
                                >
                                    -
                                </Button>
                                <Text>{item.quantity}</Text>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        increaseQuantity(item.productId, `${item.productId}-${item.variant.size}`)
                                    }
                                >
                                    +
                                </Button>
                            </HStack>
                            <IconButton
                                aria-label="Eliminar"
                                colorPalette="red"
                                variant={"outline"}
                                onClick={() =>
                                    removeFromCart(
                                        item.productId,
                                        `${item.productId}-${item.variant.size}`
                                    )
                                }
                            >
                                <FiTrash2 />
                            </IconButton>
                        </HStack>
                    </Box>
                ))}
            </VStack>

            <Separator my={6} />

            <HStack justify="space-between" mb={4}>
                <Text fontSize="xl" fontWeight="bold">
                    Total:
                </Text>
                <Text fontSize="2xl" color="red.500" fontWeight="bold">
                    ${total}
                </Text>
            </HStack>

            <HStack gap={4}>
                <Button
                    colorScheme="red"
                    onClick={handleCreateOrder}
                    loading={loading}
                >
                    Finalizar compra
                </Button>
                <Button variant="outline" onClick={clearCart}>
                    Vaciar carrito
                </Button>
            </HStack>
        </Box>
    );
}
