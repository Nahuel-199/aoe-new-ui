"use client";

import { useMemo } from "react";
import { Box, Flex, Grid, Image, Input, Link, Text } from "@chakra-ui/react";
import { AdminOrder } from "@/types/order.types";
import { OrderTabValue } from "@/lib/constants/adminNav";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

const FLOW: AdminOrder["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_LABELS: Record<AdminOrder["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  shipped: "En camino",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<AdminOrder["status"], string> = {
  pending: "#fbbf24",
  confirmed: "#60a5fa",
  shipped: "#a78bfa",
  delivered: "#34d399",
  cancelled: "#e11d2e",
};

const TABS: { value: OrderTabValue; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "shipped", label: "En camino" },
  { value: "delivered", label: "Entregadas" },
  { value: "all", label: "Todas" },
];

function matchesTab(order: AdminOrder, tab: OrderTabValue) {
  if (tab === "all") return true;
  return order.status === tab;
}

interface OrdersScreenProps {
  orders: AdminOrder[];
  query: string;
  onQueryChange: (q: string) => void;
  orderTab: OrderTabValue;
  onOrderTabChange: (t: OrderTabValue) => void;
  onSetStatus: (order: AdminOrder, status: AdminOrder["status"]) => void;
}

export default function OrdersScreen({
  orders,
  query,
  onQueryChange,
  orderTab,
  onOrderTabChange,
  onSetStatus,
}: OrdersScreenProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (q) {
        const haystack = `${o.user.name} ${o.user.email} ${o._id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return matchesTab(o, orderTab);
    });
  }, [orders, query, orderTab]);

  return (
    <Box>
      <Flex align="center" gap="10px" h="50px" px="14px" border="1px solid" borderColor="aoe.borderControl" bg="aoe.tile" borderRadius="14px">
        <Text color="aoe.textMuted" fontSize="15px">
          ⌕
        </Text>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Nombre, email o #orden"
          flex={1}
          minW={0}
          bg="transparent"
          border="none"
          outline="none"
          color="aoe.text"
          fontSize="16px"
          px={0}
          h="auto"
          _focusVisible={{ outline: "none" }}
        />
      </Flex>

      <Flex gap="8px" overflowX="auto" py="14px">
        {TABS.map((t) => {
          const active = orderTab === t.value;
          const count = orders.filter((o) => matchesTab(o, t.value)).length;
          return (
            <Box
              key={t.value}
              as="button"
              onClick={() => onOrderTabChange(t.value)}
              flexShrink={0}
              h="36px"
              px="14px"
              borderRadius="pill"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg={active ? "aoe.text" : "aoe.chip"}
              color={active ? "aoe.bg" : "aoe.textMuted"}
              fontSize="12px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.04em"
              display="flex"
              alignItems="center"
              gap="7px"
            >
              {t.label}
              <Text as="span" fontFamily="mono" fontSize="11px" opacity={0.75}>
                {count}
              </Text>
            </Box>
          );
        })}
      </Flex>

      <Box display="grid" gap="12px" mt="4px">
        {filtered.map((o) => {
          const paid = o.paidAmount ?? 0;
          const due = Math.max(0, o.total - paid);
          const shippingLabel =
            o.deliveryMethod === "correo"
              ? o.shippingAddress
                ? `Correo · ${o.shippingAddress.city}, ${o.shippingAddress.province}`
                : "Correo Argentino"
              : o.meetingAddress
              ? `Encuentro · ${o.meetingAddress}`
              : "Punto de encuentro";
          const paymentLabel = o.paymentProvider === "mercadopago" ? "Mercado Pago" : o.paymentMethod || "Sin especificar";

          return (
            <Box key={o._id} border="1px solid" borderColor="aoe.borderSubtle" bg="aoe.tile" borderRadius="18px" overflow="hidden">
              <Flex p="14px" gap="12px" align="flex-start" borderBottom="1px solid" borderColor="aoe.borderSubtle">
                <Box minW={0} flex={1}>
                  <Text fontSize="16px" fontWeight="700" color="aoe.text">
                    {o.user.name}
                  </Text>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.06em" mt="4px">
                    #{o._id.slice(-8)} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  </Text>
                </Box>
                <Box
                  border="1px solid"
                  borderColor={STATUS_COLORS[o.status]}
                  color={STATUS_COLORS[o.status]}
                  borderRadius="pill"
                  px="10px"
                  py="4px"
                  fontFamily="mono"
                  fontSize="11px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  whiteSpace="nowrap"
                >
                  {STATUS_LABELS[o.status]}
                </Box>
              </Flex>

              <Box p="12px 14px" display="grid" gap="10px">
                {o.items.map((it, idx) => (
                  <Grid key={idx} templateColumns="44px 1fr auto" gap="10px" alignItems="center">
                    <Box w="44px" h="54px" borderRadius="8px" bg="aoe.chip" overflow="hidden">
                      {(it.variant.imageUrl || it.productImage) && (
                        <Image src={it.variant.imageUrl || it.productImage || ""} alt="" w="100%" h="100%" objectFit="cover" />
                      )}
                    </Box>
                    <Box minW={0}>
                      <Text fontSize="14px" fontWeight="600" color="aoe.text">
                        {it.productName}
                      </Text>
                      <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" mt="3px" textTransform="uppercase">
                        {it.variant.type} · {it.variant.color} · {it.variant.size} ×{it.variant.quantity}
                      </Text>
                    </Box>
                    <Text fontSize="13px" fontWeight="700" whiteSpace="nowrap" color="aoe.text">
                      {ars(it.subtotal)}
                    </Text>
                  </Grid>
                ))}
              </Box>

              <Grid
                p="12px 14px"
                bg="aoe.bg"
                borderTop="1px solid"
                borderColor="aoe.borderSubtle"
                templateColumns="repeat(auto-fit, minmax(120px, 1fr))"
                gap="10px"
              >
                <Box minW={0}>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Pago
                  </Text>
                  <Text fontSize="13px" fontWeight="600" mt="3px" color="aoe.textMuted">
                    {paymentLabel}
                  </Text>
                </Box>
                <Box minW={0}>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Pagado
                  </Text>
                  <Text fontSize="13px" fontWeight="600" mt="3px" color="aoe.green">
                    {ars(paid)}
                  </Text>
                </Box>
                <Box minW={0}>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Resta
                  </Text>
                  <Text fontSize="13px" fontWeight="600" mt="3px" color={due === 0 ? "aoe.textSubtle" : "aoe.amber"}>
                    {due === 0 ? "Sin saldo" : ars(due)}
                  </Text>
                </Box>
                <Box minW={0}>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Envío
                  </Text>
                  <Text fontSize="13px" fontWeight="600" mt="3px" color="aoe.textMuted">
                    {shippingLabel}
                  </Text>
                </Box>
              </Grid>

              <Box p="14px" borderTop="1px solid" borderColor="aoe.borderSubtle">
                <Flex justify="space-between" align="baseline" mb="12px">
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textSubtle" letterSpacing="0.12em" textTransform="uppercase">
                    Total
                  </Text>
                  <Text fontSize="22px" fontWeight="800" color="aoe.text">
                    {ars(o.total)}
                  </Text>
                </Flex>
                <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase" mb="8px">
                  Cambiar estado
                </Text>
                <Flex gap="8px" overflowX="auto" pb="4px">
                  {FLOW.map((st) => {
                    const on = o.status === st;
                    return (
                      <Box
                        key={st}
                        as="button"
                        onClick={() => onSetStatus(o, st)}
                        flexShrink={0}
                        h="42px"
                        px="14px"
                        borderRadius="11px"
                        border="1px solid"
                        borderColor={on ? STATUS_COLORS[st] : "aoe.borderControl"}
                        bg={on ? STATUS_COLORS[st] : "aoe.chip"}
                        color={on ? "aoe.bg" : "aoe.textMuted"}
                        fontSize="12px"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.04em"
                      >
                        {STATUS_LABELS[st]}
                      </Box>
                    );
                  })}
                </Flex>
                <Link
                  href={`https://wa.me/54${(o.phoneNumber || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  mt="12px"
                  h="46px"
                  borderRadius="12px"
                  bg="aoe.red"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="12px"
                  fontWeight="800"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  _hover={{ textDecoration: "none" }}
                >
                  Escribir por WhatsApp
                </Link>
              </Box>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Text color="aoe.textSubtle" fontSize="13px" textAlign="center" py={8}>
            No hay órdenes en este estado.
          </Text>
        )}
      </Box>
    </Box>
  );
}
