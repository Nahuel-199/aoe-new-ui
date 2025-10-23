"use client";

import { useCart } from "@/context/CartContext";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Separator,
  IconButton,
  Badge,
  Image,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order.actions";
import { showToast } from "nextjs-toast-notify";
import { useSession } from "next-auth/react";

export default function CartSection() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const total = cart.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    if (!session) {
      showToast.warning("Debes iniciar sesión para continuar con la compra.", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
        sound: true,
      });

      router.push("/login");
      return;
    }

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

      const order = await createOrder({
        items,
      });

      showToast.success("¡Orden de compra creada exitósamente!", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
        sound: true,
      });

      setTimeout(() => {
        const phoneNumber = "5491124969558";
        let message = `¡Hola! 👋 Vengo desde la página y quiero confirmar este pedido:\n\n`;

        cart.forEach((item, index) => {
          message += `*${index + 1}. ${item.name}*\n`;
          message += `   🧥 Tipo: _${item.variant.type}_\n`;
          message += `   🎨 Color: _${item.variant.color}_\n`;
          message += `   📏 Talle: _${item.variant.size}_\n`;
          message += `   🔢 Cantidad: *${item.quantity}*\n`;
          message += `   💰 Precio: $${item.variant.price} c/u\n`;
          message += `   ➕ Subtotal: *$${item.variant.price * item.quantity}*\n\n`;
        });

        message += `━━━━━━━━━━━━━━━\n`;
        message += `💵 *Total a pagar:* $${total}\n`;
        message += `━━━━━━━━━━━━━━━\n\n`;
        message += `🙌 ¡Desde ya muchas gracias! Espero tu confirmación para coordinar el envío 🚚✨`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        clearCart();
        window.open(whatsappLink, "_blank");
        router.push("/mis-pedidos");
      }, 2000);
    } catch (error) {
      showToast.error("Error creando la orden de compra", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
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
    <Box maxW="900px" mx="auto" p={{ base: 3, md: 6 }}>
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
            p={{ base: 3, md: 4 }}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "start", sm: "center" }}
              justify="space-between"
              gap={{ base: 3, md: 6 }}
            >

              <Stack direction={{ base: "column", sm: "row" }} align="center" gap={4}>
                <Image
                  src={item.variant.imageUrl}
                  alt={item.name}
                  boxSize={{ base: "80px", sm: "100px" }}
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <HStack flexWrap="wrap" gap={1}>
                    <Badge>Tipo: {item.variant.type}</Badge>
                    <Badge>Color: {item.variant.color}</Badge>
                    <Badge>Talle: {item.variant.size}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    ${item.variant.price} x {item.quantity} ={" "}
                    <Text as="span" fontWeight="bold">
                      ${item.variant.price * item.quantity}
                    </Text>
                  </Text>
                </VStack>
              </Stack>

              <HStack
                justify={{ base: "space-between", sm: "flex-end" }}
                align="center"
                w="full"
                mt={{ base: 3, sm: 0 }}
              >
                <HStack>
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
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    removeFromCart(item.productId, `${item.productId}-${item.variant.size}`)
                  }
                >
                  <FiTrash2 />
                </IconButton>
              </HStack>
            </Flex>
          </Box>
        ))}

        <Separator my={4} />

        {/* Total y botones */}
        <Flex direction={{ base: "column", sm: "row" }} justify="space-between" gap={4}>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            Total:{" "}
            <Text as="span" color="red.500">
              ${total}
            </Text>
          </Text>

          <HStack w={{ base: "full", sm: "auto" }} gap={3}>
            <Button
              colorScheme="red"
              onClick={handleCreateOrder}
              loading={loading || status === "loading"}
              w={{ base: "full", sm: "auto" }}
            >
              Finalizar compra
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              w={{ base: "full", sm: "auto" }}
            >
              Vaciar carrito
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  )
}