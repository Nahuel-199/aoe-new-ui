"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Box, Button, Field, Flex, Input, Text } from "@chakra-ui/react";
import { showToast } from "nextjs-toast-notify";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/actions/order.actions";
import { createPaymentPreference } from "@/lib/actions/payment.actions";
import DeliveryMethodSelector, {
  DeliveryMethod,
} from "@/_components/checkout/DeliveryMethodSelector";
import ShippingAddressStep from "@/_components/checkout/ShippingAddressStep";
import MeetingPointSelector from "@/_components/checkout/MeetingPointSelector";
import { ShippingAddress } from "@/types/address.types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

const EMPTY_ADDRESS: ShippingAddress = {
  street: "",
  streetNumber: "",
  floorApt: "",
  city: "",
  province: "",
  postalCode: "",
};

function notify(kind: "success" | "error" | "warning", message: string) {
  showToast[kind](message, {
    duration: 4000,
    progress: true,
    position: "top-center",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("correo");
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [meetingPoint, setMeetingPoint] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0),
    [cart]
  );

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const effectiveShippingCost =
    deliveryMethod === "correo" ? (freeShipping ? 0 : shippingCost ?? 0) : 0;
  const total = subtotal + effectiveShippingCost;

  const isAddressComplete =
    address.street &&
    address.streetNumber &&
    address.city &&
    address.province &&
    address.postalCode.replace(/\D/g, "").length >= 4;

  const canSubmit =
    cart.length > 0 &&
    phoneNumber.trim().length > 0 &&
    (deliveryMethod === "punto_encuentro"
      ? meetingPoint.length > 0
      : isAddressComplete && (freeShipping || shippingCost !== null));

  const handleSubmit = async () => {
    if (!session) {
      notify("warning", "Debés iniciar sesión para continuar con la compra.");
      router.push("/login");
      return;
    }

    if (!canSubmit) {
      notify("warning", "Completá todos los datos requeridos para continuar.");
      return;
    }

    setLoading(true);
    try {
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
        deliveryMethod,
        shippingAddress: deliveryMethod === "correo" ? address : undefined,
        meetingAddress: deliveryMethod === "punto_encuentro" ? meetingPoint : undefined,
        phoneNumber,
      });

      const orderId = String(order._id);
      const preference = await createPaymentPreference(orderId);

      if (!preference.success) {
        notify("error", preference.message);
        return;
      }

      clearCart();
      window.location.href = preference.initPoint;
    } catch (error) {
      console.error("Error iniciando el checkout:", error);
      notify("error", "No pudimos iniciar la compra. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center" textAlign="center" px={6}>
        <Box>
          <Text fontFamily="heading" fontSize="2xl" textTransform="uppercase" color="aoe.text">
            Tu carrito está vacío
          </Text>
          <Button
            mt={4}
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
            onClick={() => router.push("/products")}
          >
            Ver productos
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="720px" mx="auto" px={{ base: 4, md: 6 }} py={10} display="grid" gap={8}>
      <Text fontFamily="heading" fontSize="3xl" textTransform="uppercase" color="aoe.text">
        Finalizar compra
      </Text>

      <Box display="grid" gap={4}>
        <Text fontFamily="mono" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" color="aoe.textMuted">
          Resumen
        </Text>
        {cart.map((item, idx) => (
          <Flex key={idx} justify="space-between" fontSize="sm" color="aoe.text">
            <Text>
              {item.name} · {item.variant.color} · Talle {item.variant.size} × {item.quantity}
            </Text>
            <Text fontWeight="700">{ars(item.variant.price * item.quantity)}</Text>
          </Flex>
        ))}
      </Box>

      <Box display="grid" gap={4}>
        <Text fontFamily="mono" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" color="aoe.textMuted">
          Contacto
        </Text>
        <Field.Root required>
          <Field.Label>Teléfono</Field.Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ej: 1123456789"
          />
        </Field.Root>
      </Box>

      <Box display="grid" gap={4}>
        <Text fontFamily="mono" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" color="aoe.textMuted">
          Entrega
        </Text>
        <DeliveryMethodSelector value={deliveryMethod} onChange={setDeliveryMethod} />
        {deliveryMethod === "correo" ? (
          <ShippingAddressStep
            address={address}
            onAddressChange={setAddress}
            onCostChange={setShippingCost}
            subtotal={subtotal}
          />
        ) : (
          <MeetingPointSelector value={meetingPoint} onChange={setMeetingPoint} />
        )}
      </Box>

      <Box borderTop="1px solid" borderColor="aoe.borderSubtle" pt={4}>
        <Flex justify="space-between" fontSize="sm" color="aoe.textMuted" mb={1}>
          <Text>Subtotal</Text>
          <Text>{ars(subtotal)}</Text>
        </Flex>
        <Flex justify="space-between" fontSize="sm" color="aoe.textMuted" mb={3}>
          <Text>Envío</Text>
          <Text>
            {deliveryMethod === "punto_encuentro"
              ? meetingPoint
                ? `Encuentro en ${meetingPoint}`
                : "A coordinar"
              : freeShipping
              ? "Gratis"
              : shippingCost !== null
              ? ars(shippingCost)
              : "A calcular"}
          </Text>
        </Flex>
        <Flex justify="space-between" fontSize="sm" color="aoe.textMuted" mb={4}>
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
          loading={loading}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Pagar con Mercado Pago
        </Button>
      </Box>
    </Box>
  );
}
