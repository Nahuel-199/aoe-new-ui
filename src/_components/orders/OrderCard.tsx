"use client";

import { useState } from "react";
import { Box, Button, Flex, Grid, Image, Link, Text } from "@chakra-ui/react";
import { showToast } from "nextjs-toast-notify";
import { CustomerOrder } from "@/types/order.types";
import { useCart } from "@/context/CartContext";
import { createPaymentPreference } from "@/lib/actions/payment.actions";

const FLOW: CustomerOrder["status"][] = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_LABELS: Record<CustomerOrder["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  shipped: "En camino",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<CustomerOrder["status"], string> = {
  pending: "#fbbf24",
  confirmed: "#60a5fa",
  shipped: "#a78bfa",
  delivered: "#34d399",
  cancelled: "#e11d2e",
};

const TRACKING_MESSAGE: Record<CustomerOrder["status"], string> = {
  pending: "Estamos confirmando tu pago.",
  confirmed: "Estamos preparando tu pedido.",
  shipped: "Tu pedido está en camino.",
  delivered: "¡Entregado! Esperamos que lo disfrutes.",
  cancelled: "Este pedido fue cancelado.",
};

const WHATSAPP_NUMBER = "5491124969558";
const ars = (n: number) => "$" + n.toLocaleString("es-AR");

function notify(kind: "success" | "error", message: string) {
  showToast[kind](message, {
    duration: 4000,
    progress: true,
    position: "top-center",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
}

export default function OrderCard({ order }: { order: CustomerOrder }) {
  const { addToCart, openCart } = useCart();
  const [payingLoading, setPayingLoading] = useState(false);

  const stepIndex = FLOW.indexOf(order.status);
  const cancelled = order.status === "cancelled";
  const paid = order.paidAmount ?? 0;
  const due = Math.max(0, order.total - paid);
  const canCompletePayment = order.paymentStatus === "pending" || order.paymentStatus === "in_process";

  const ref = order._id.slice(-8);
  const headline = order.items.length === 1 ? order.items[0].productName : `${order.items.length} productos`;
  const placedLabel = new Date(order.createdAt).toLocaleString("es-AR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentLabel =
    order.paymentProvider === "mercadopago" ? "Mercado Pago" : order.paymentMethod || "Sin especificar";

  const shippingLabel =
    order.deliveryMethod === "correo"
      ? order.shippingAddress
        ? `Correo Argentino · ${order.shippingAddress.city}, ${order.shippingAddress.province}`
        : "Correo Argentino"
      : order.meetingAddress
      ? `Punto de encuentro · ${order.meetingAddress}`
      : "Punto de encuentro";

  const handleRebuy = (item: CustomerOrder["items"][number]) => {
    addToCart({
      productId: item.productId,
      name: item.productName,
      variant: {
        type: item.variant.type,
        color: item.variant.color,
        size: item.variant.size,
        price: item.variant.price,
        imageUrl: item.variant.imageUrl || item.productImage || "",
      },
      quantity: 1,
    });
    openCart();
    notify("success", `${item.productName} agregado al carrito`);
  };

  const handleCompletePayment = async () => {
    setPayingLoading(true);
    try {
      const result = await createPaymentPreference(order._id);
      if (!result.success) {
        notify("error", result.message);
        return;
      }
      window.location.href = result.initPoint;
    } finally {
      setPayingLoading(false);
    }
  };

  return (
    <Box border="1px solid" borderColor="aoe.borderSubtle" bg="aoe.bgAlt" borderRadius="20px" overflow="hidden">
      <Flex
        px={5}
        py="18px"
        borderBottom="1px solid"
        borderColor="aoe.borderSubtle"
        gap={4}
        align="flex-start"
        wrap="wrap"
      >
        <Box minW={0} flex={1}>
          <Text fontFamily="mono" fontSize="10px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Pedido #{ref}
          </Text>
          <Text fontFamily="heading" fontSize="24px" textTransform="uppercase" mt="6px" lineHeight="1.1" color="aoe.text">
            {headline}
          </Text>
          <Text fontSize="13px" color="aoe.textSubtle" mt="5px">
            Comprado el {placedLabel}
          </Text>
        </Box>
        <Flex direction="column" align="flex-end" gap={2}>
          <Box
            as="span"
            border="1px solid"
            borderColor={STATUS_COLORS[order.status]}
            color={STATUS_COLORS[order.status]}
            borderRadius="pill"
            px="12px"
            py="5px"
            fontFamily="mono"
            fontSize="10px"
            letterSpacing="0.1em"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {STATUS_LABELS[order.status]}
          </Box>
          <Text fontSize="22px" fontWeight="800" whiteSpace="nowrap" color="aoe.text">
            {ars(order.total)}
          </Text>
        </Flex>
      </Flex>

      <Box px={5} py="20px" borderBottom="1px solid" borderColor="aoe.borderSubtle">
        <Flex justify="space-between" align="baseline" gap={2} mb={4} wrap="wrap">
          <Text fontFamily="mono" fontSize="10px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Seguimiento
          </Text>
          <Text fontSize="13px" color="aoe.textMuted">
            {TRACKING_MESSAGE[order.status]}
          </Text>
        </Flex>

        {!cancelled && (
          <Box position="relative">
            <Box position="absolute" left={0} right={0} top="13px" h="2px" bg="aoe.borderSubtle" />
            <Box
              position="absolute"
              left={0}
              top="13px"
              h="2px"
              bg="aoe.red"
              width={`${(stepIndex / (FLOW.length - 1)) * 100}%`}
            />
            <Grid position="relative" templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
              {FLOW.map((step, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <Flex key={step} direction="column" align="center" gap="9px" textAlign="center" minW={0}>
                    <Box
                      w="28px"
                      h="28px"
                      borderRadius="pill"
                      border="2px solid"
                      borderColor={i <= stepIndex ? "aoe.red" : "aoe.borderControl"}
                      bg={done ? "aoe.red" : "aoe.bgAlt"}
                      color={done ? "white" : "aoe.red"}
                      display="grid"
                      placeItems="center"
                      fontSize="12px"
                      fontWeight="800"
                      flexShrink={0}
                    >
                      {done ? "✓" : current ? "●" : ""}
                    </Box>
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      letterSpacing="0.02em"
                      textTransform="uppercase"
                      color={i <= stepIndex ? "aoe.text" : "aoe.textGhost"}
                      lineHeight="1.25"
                    >
                      {STATUS_LABELS[step]}
                    </Text>
                  </Flex>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>

      <Box px={5} py="18px" display="grid" gap="14px" borderBottom="1px solid" borderColor="aoe.borderSubtle">
        {order.items.map((item, idx) => (
          <Grid key={idx} templateColumns="72px 1fr auto" gap="14px" alignItems="center">
            <Box w="72px" h="90px" borderRadius="12px" bg="aoe.tile" overflow="hidden">
              {(item.variant.imageUrl || item.productImage) && (
                <Image
                  src={item.variant.imageUrl || item.productImage || ""}
                  alt={item.productName}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              )}
            </Box>
            <Box minW={0}>
              <Text fontSize="15px" fontWeight="700" lineHeight="1.3" color="aoe.text">
                {item.productName}
              </Text>
              <Text
                fontFamily="mono"
                fontSize="10px"
                color="aoe.textFaint"
                letterSpacing="0.08em"
                textTransform="uppercase"
                mt="5px"
              >
                {item.variant.type} · {item.variant.color} · Talle {item.variant.size} × {item.variant.quantity}
              </Text>
              <Button
                onClick={() => handleRebuy(item)}
                variant="plain"
                p={0}
                mt="10px"
                h="auto"
                color="aoe.red"
                fontSize="12px"
                fontWeight="800"
                letterSpacing="0.06em"
                textTransform="uppercase"
                _hover={{ textDecoration: "underline" }}
              >
                Volver a comprar
              </Button>
            </Box>
            <Text textAlign="right" whiteSpace="nowrap" fontSize="15px" fontWeight="800" color="aoe.text">
              {ars(item.subtotal)}
            </Text>
          </Grid>
        ))}
      </Box>

      <Grid
        px={5}
        py="16px"
        bg="aoe.bg"
        templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        gap="16px"
        borderBottom="1px solid"
        borderColor="aoe.borderSubtle"
      >
        <Box minW={0}>
          <Text fontFamily="mono" fontSize="9px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Pago
          </Text>
          <Text fontSize="13px" fontWeight="600" color="aoe.textMuted" mt="4px">
            {paymentLabel}
          </Text>
        </Box>
        <Box minW={0}>
          <Text fontFamily="mono" fontSize="9px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Abonado
          </Text>
          <Text fontSize="13px" fontWeight="600" color={paid > 0 ? "aoe.green" : "aoe.textSubtle"} mt="4px">
            {ars(paid)}
          </Text>
        </Box>
        <Box minW={0}>
          <Text fontFamily="mono" fontSize="9px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Saldo
          </Text>
          <Text fontSize="13px" fontWeight="600" color={due === 0 ? "aoe.textSubtle" : "aoe.amber"} mt="4px">
            {due === 0 ? "Sin saldo pendiente" : ars(due)}
          </Text>
        </Box>
        <Box minW={0}>
          <Text fontFamily="mono" fontSize="9px" color="aoe.textGhost" letterSpacing="0.12em" textTransform="uppercase">
            Envío
          </Text>
          <Text fontSize="13px" fontWeight="600" color="aoe.textMuted" mt="4px" lineHeight="1.35">
            {shippingLabel}
          </Text>
        </Box>
      </Grid>

      <Flex px={5} py="20px" gap="10px" wrap="wrap">
        {canCompletePayment && (
          <Button
            onClick={handleCompletePayment}
            loading={payingLoading}
            flex={1}
            minW="200px"
            h="50px"
            borderRadius="pill"
            border="none"
            bg="aoe.red"
            color="white"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.1em"
            textTransform="uppercase"
            _hover={{ bg: "aoe.text", color: "aoe.bg" }}
          >
            Completar el pago
          </Button>
        )}
        <Link
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Hola! Consulta por el pedido #${ref}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          h="50px"
          px="22px"
          borderRadius="pill"
          border="1px solid"
          borderColor="aoe.borderControl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="12px"
          fontWeight="800"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color="aoe.text"
          _hover={{ borderColor: "aoe.red", textDecoration: "none" }}
        >
          Ayuda con este pedido
        </Link>
      </Flex>
    </Box>
  );
}
