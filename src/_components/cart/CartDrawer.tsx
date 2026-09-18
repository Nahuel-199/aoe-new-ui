"use client";

import { useCart } from "@/context/CartContext";
import {
  Box,
  Text,
  Button,
  IconButton,
  Image,
  Flex,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { useSession } from "next-auth/react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    cartOpen,
    closeCart,
  } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );
  const freeShip = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const total = subtotal;

  const handleGoToCheckout = () => {
    if (!session) {
      showToast.warning("Debes iniciar sesión para continuar con la compra.", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
        sound: true,
      });
      closeCart();
      router.push("/login");
      return;
    }

    closeCart();
    router.push("/checkout");
  };

  if (!cartOpen) return null;

  return (
    <Box position="fixed" inset={0} zIndex={90} display="flex" justifyContent="flex-end">
      <Box
        as="button"
        aria-label="Cerrar"
        position="absolute"
        inset={0}
        bg="rgba(0,0,0,0.65)"
        backdropFilter="blur(2px)"
        border="none"
        cursor="pointer"
        onClick={closeCart}
      />
      <Box
        as="aside"
        position="relative"
        w={{ base: "100%", sm: "420px" }}
        h="100%"
        bg="aoe.bgAlt"
        borderLeft="1px solid"
        borderColor="aoe.borderSubtle"
        display="flex"
        flexDirection="column"
        animation="aoeSlide 0.28s cubic-bezier(0.22,1,0.36,1)"
      >
        <Flex
          p={5}
          borderBottom="1px solid"
          borderColor="aoe.borderSubtle"
          align="center"
          justify="space-between"
        >
          <Text fontFamily="heading" fontSize="2xl" textTransform="uppercase" color="aoe.text">
            Tu carrito
          </Text>
          <IconButton
            aria-label="Cerrar carrito"
            variant="ghost"
            color="aoe.textFaint"
            onClick={closeCart}
          >
            <FiX />
          </IconButton>
        </Flex>

        <Box px={5} py={4} borderBottom="1px solid" borderColor="aoe.borderSubtle">
          <Flex
            justify="space-between"
            fontFamily="mono"
            fontSize="10px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            color="aoe.textMuted"
            mb={2}
          >
            <Text>
              {freeShip
                ? "¡Tenés envío gratis!"
                : subtotal > 0
                ? `Te faltan ${ars(missing)} para envío gratis`
                : "Envío gratis desde " + ars(FREE_SHIPPING_THRESHOLD)}
            </Text>
            <Text>{pct}%</Text>
          </Flex>
          <Box h="5px" borderRadius="pill" bg="aoe.borderSubtle" overflow="hidden">
            <Box h="100%" bg="aoe.red" borderRadius="pill" width={`${pct}%`} transition="width 0.3s ease" />
          </Box>
        </Box>

        <Box flex={1} overflowY="auto" px={5} py={4} display="grid" gap={4} alignContent="start">
          {cart.length === 0 ? (
            <Box textAlign="center" py={12} px={2}>
              <Text fontFamily="heading" fontSize="xl" textTransform="uppercase" color="aoe.text">
                Todavía está vacío
              </Text>
              <Text color="aoe.textSubtle" fontSize="sm" mt={2} mb={5}>
                Sumá una prenda y te llega en 3 a 5 días.
              </Text>
              <Button
                bg="aoe.text"
                color="aoe.bg"
                borderRadius="pill"
                h="46px"
                px={6}
                fontFamily="mono"
                fontSize="xs"
                letterSpacing="0.08em"
                textTransform="uppercase"
                _hover={{ bg: "aoe.red", color: "white" }}
                onClick={() => {
                  closeCart();
                  router.push("/products");
                }}
              >
                Ver productos
              </Button>
            </Box>
          ) : (
            cart.map((item, idx) => {
              const variantKey = `${item.productId}-${item.variant.size}`;
              return (
                <Flex key={idx} gap={3} align="start">
                  <Image
                    src={item.variant.imageUrl}
                    alt={item.name}
                    w="74px"
                    h="92px"
                    objectFit="cover"
                    borderRadius="10px"
                    bg="aoe.surface"
                  />
                  <Box flex={1} minW={0}>
                    <Flex justify="space-between" gap={2}>
                      <Text fontSize="sm" fontWeight="700" color="aoe.text">
                        {item.name}
                      </Text>
                      <IconButton
                        aria-label="Quitar"
                        variant="ghost"
                        size="xs"
                        color="aoe.textGhost"
                        onClick={() => removeFromCart(item.productId, variantKey)}
                      >
                        <FiX />
                      </IconButton>
                    </Flex>
                    <Text
                      fontFamily="mono"
                      fontSize="10px"
                      color="aoe.textFaint"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      mt={1}
                    >
                      Talle {item.variant.size} · {item.variant.color}
                    </Text>
                    <Flex align="center" justify="space-between" mt={2}>
                      <Flex
                        align="center"
                        gap="2px"
                        border="1px solid"
                        borderColor="aoe.borderControl"
                        borderRadius="pill"
                        p="2px"
                      >
                        <IconButton
                          aria-label="Restar"
                          size="xs"
                          variant="ghost"
                          borderRadius="pill"
                          color="aoe.text"
                          onClick={() => decreaseQuantity(item.productId, variantKey)}
                        >
                          −
                        </IconButton>
                        <Text fontFamily="mono" fontSize="xs" minW="20px" textAlign="center" color="aoe.text">
                          {item.quantity}
                        </Text>
                        <IconButton
                          aria-label="Sumar"
                          size="xs"
                          variant="ghost"
                          borderRadius="pill"
                          color="aoe.text"
                          onClick={() => increaseQuantity(item.productId, variantKey)}
                        >
                          +
                        </IconButton>
                      </Flex>
                      <Text fontSize="sm" fontWeight="800" color="aoe.text">
                        {ars(item.variant.price * item.quantity)}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              );
            })
          )}
        </Box>

        {cart.length > 0 && (
          <Box px={5} pt={4} pb={6} borderTop="1px solid" borderColor="aoe.borderSubtle" bg="aoe.bg">
            <Flex justify="space-between" fontSize="sm" color="aoe.textMuted" mb={3}>
              <Text>Total</Text>
              <Text fontSize="xl" fontWeight="800" color="aoe.text">
                {ars(total)}
              </Text>
            </Flex>
            <Button
              w="full"
              h="56px"
              bg="aoe.red"
              color="white"
              borderRadius="pill"
              fontFamily="mono"
              fontSize="xs"
              fontWeight="800"
              letterSpacing="0.1em"
              textTransform="uppercase"
              _hover={{ bg: "aoe.text", color: "aoe.bg" }}
              loading={status === "loading"}
              onClick={handleGoToCheckout}
            >
              Finalizar compra
            </Button>
            <Button
              w="full"
              mt={2}
              variant="ghost"
              color="aoe.textFaint"
              fontSize="xs"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
