"use client";

import { useMemo } from "react";
import { Box, Grid, Image, Text } from "@chakra-ui/react";
import { Product } from "@/types/product.types";
import { AdminOrder } from "@/types/order.types";
import { OrderTabValue, ProductFilterValue } from "@/lib/constants/adminNav";
import { getTotalStock, isLowStock } from "@/lib/productStock";
import { cldThumb } from "@/utils/cloudinaryImage";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

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

interface PanelScreenProps {
  products: Product[];
  orders: AdminOrder[];
  onGoOrders: (orderTab: OrderTabValue, query?: string) => void;
  onGoProducts: (filter: ProductFilterValue) => void;
  onGoCustom: () => void;
  onGoForm: () => void;
  onGoCategories: () => void;
  onGoHero: () => void;
}

export default function PanelScreen({
  products,
  orders,
  onGoOrders,
  onGoProducts,
  onGoCustom,
  onGoForm,
  onGoCategories,
  onGoHero,
}: PanelScreenProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const revenueThisMonth = orders
      .filter((o) => {
        if (o.status === "cancelled") return false;
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((acc, o) => acc + o.total, 0);

    const pending = orders.filter((o) => o.status === "pending");
    const lowStock = products.filter(isLowStock);
    const outOfStock = products.filter((p) => getTotalStock(p) === 0);

    return { revenueThisMonth, pending, lowStock, outOfStock };
  }, [orders, products]);

  const hasAlerts = stats.pending.length + stats.lowStock.length + stats.outOfStock.length > 0;

  const kpis = [
    {
      label: "Ventas del mes",
      value: ars(stats.revenueThisMonth),
      delta: "Órdenes no canceladas",
      dot: "#34d399",
      onClick: () => onGoOrders("all"),
    },
    {
      label: "A preparar",
      value: String(stats.pending.length),
      delta: stats.pending.length ? "Confirmá los pagos" : "Todo al día",
      deltaColor: stats.pending.length ? "aoe.amber" : "aoe.textSubtle",
      dot: "#fbbf24",
      onClick: () => onGoOrders("pending"),
    },
    {
      label: "Productos",
      value: String(products.length),
      delta: `${stats.outOfStock.length} sin stock`,
      dot: "#60a5fa",
      onClick: () => onGoProducts("all"),
    },
    {
      label: "Stock bajo",
      value: String(stats.lowStock.length),
      delta: "Reponer esta semana",
      deltaColor: "#e11d2e",
      dot: "#e11d2e",
      onClick: () => onGoProducts("lowStock"),
    },
  ];

  const quickActions = [
    { icon: "＋", label: "Crear producto", onClick: onGoForm },
    { icon: "✦", label: "Pedido personalizado", onClick: onGoCustom },
    { icon: "％", label: "Armar una oferta", onClick: () => onGoProducts("onSale") },
    { icon: "▦", label: "Categorías y subcategorías", onClick: onGoCategories },
    { icon: "🖼", label: "Imágenes de portada", onClick: onGoHero },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <Box>
      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap="10px">
        {kpis.map((k) => (
          <Box
            key={k.label}
            as="button"
            onClick={k.onClick}
            textAlign="left"
            border="1px solid"
            borderColor="aoe.borderSubtle"
            bg="aoe.tile"
            borderRadius="16px"
            p={4}
            minW={0}
            color="aoe.text"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
              <Text fontFamily="mono" fontSize="11px" color="aoe.textSubtle" letterSpacing="0.1em" textTransform="uppercase">
                {k.label}
              </Text>
              <Box w="8px" h="8px" borderRadius="pill" bg={k.dot} />
            </Box>
            <Text fontFamily="heading" fontSize="34px" lineHeight="1.05" mt="10px">
              {k.value}
            </Text>
            <Text fontSize="12px" color={k.deltaColor || "aoe.textSubtle"} mt="4px">
              {k.delta}
            </Text>
          </Box>
        ))}
      </Grid>

      {hasAlerts && (
        <Box mt="14px" border="1px solid" borderColor="#3d1519" bg="#150a0c" borderRadius="16px" p={4}>
          <Text fontFamily="mono" fontSize="11px" letterSpacing="0.12em" textTransform="uppercase" color="#ff6b76">
            Requiere tu atención
          </Text>
          <Box display="grid" gap="10px" mt="12px">
            {stats.pending.length > 0 && (
              <Box
                as="button"
                onClick={() => onGoOrders("pending")}
                display="flex"
                alignItems="center"
                gap={3}
                w="full"
                textAlign="left"
                bg="transparent"
                border="none"
                color="aoe.text"
              >
                <Text fontFamily="heading" fontSize="22px" color="aoe.red" minW="28px">
                  {stats.pending.length}
                </Text>
                <Text flex={1} minW={0} fontSize="14px" lineHeight="1.35">
                  órdenes pendientes de confirmar pago
                </Text>
                <Text color="aoe.textSubtle" fontSize="16px">
                  ›
                </Text>
              </Box>
            )}
            {stats.lowStock.length > 0 && (
              <Box
                as="button"
                onClick={() => onGoProducts("lowStock")}
                display="flex"
                alignItems="center"
                gap={3}
                w="full"
                textAlign="left"
                bg="transparent"
                border="none"
                color="aoe.text"
              >
                <Text fontFamily="heading" fontSize="22px" color="aoe.red" minW="28px">
                  {stats.lowStock.length}
                </Text>
                <Text flex={1} minW={0} fontSize="14px" lineHeight="1.35">
                  productos con pocas unidades
                </Text>
                <Text color="aoe.textSubtle" fontSize="16px">
                  ›
                </Text>
              </Box>
            )}
            {stats.outOfStock.length > 0 && (
              <Box
                as="button"
                onClick={() => onGoProducts("outOfStock")}
                display="flex"
                alignItems="center"
                gap={3}
                w="full"
                textAlign="left"
                bg="transparent"
                border="none"
                color="aoe.text"
              >
                <Text fontFamily="heading" fontSize="22px" color="aoe.red" minW="28px">
                  {stats.outOfStock.length}
                </Text>
                <Text flex={1} minW={0} fontSize="14px" lineHeight="1.35">
                  productos sin stock siguen publicados
                </Text>
                <Text color="aoe.textSubtle" fontSize="16px">
                  ›
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box display="flex" alignItems="baseline" justifyContent="space-between" gap={3} mt="26px">
        <Text fontFamily="heading" fontSize="22px" textTransform="uppercase">
          Órdenes recientes
        </Text>
        <Box
          as="button"
          onClick={() => onGoOrders("all")}
          bg="transparent"
          border="none"
          color="aoe.textSubtle"
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          Ver todas →
        </Box>
      </Box>

      <Box display="grid" gap="10px" mt="12px">
        {recentOrders.length === 0 && (
          <Text color="aoe.textSubtle" fontSize="13px">
            Todavía no hay órdenes.
          </Text>
        )}
        {recentOrders.map((o) => {
          const thumbSrc = o.items[0]?.variant.imageUrl || o.items[0]?.productImage || "";
          const headline = o.items.length === 1 ? o.items[0].productName : `${o.items.length} productos`;
          return (
            <Box
              key={o._id}
              as="button"
              onClick={() => onGoOrders("all", o.user.name)}
              textAlign="left"
              w="full"
              border="1px solid"
              borderColor="aoe.borderSubtle"
              bg="aoe.tile"
              borderRadius="16px"
              p="14px"
              display="grid"
              gridTemplateColumns="52px 1fr auto"
              gap="12px"
              alignItems="center"
              color="aoe.text"
            >
              <Box w="52px" h="64px" borderRadius="10px" bg="aoe.chip" overflow="hidden">
                {thumbSrc && <Image {...cldThumb(thumbSrc, 52)} alt="" w="100%" h="100%" objectFit="cover" />}
              </Box>
              <Box minW={0}>
                <Text fontSize="15px" fontWeight="700" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                  {o.user.name}
                </Text>
                <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.06em" mt="4px">
                  #{o._id.slice(-8)} · {headline}
                </Text>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="6px"
                  mt="8px"
                  border="1px solid"
                  borderColor={STATUS_COLORS[o.status]}
                  color={STATUS_COLORS[o.status]}
                  borderRadius="pill"
                  px="9px"
                  py="3px"
                  fontFamily="mono"
                  fontSize="11px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {STATUS_LABELS[o.status]}
                </Box>
              </Box>
              <Box textAlign="right" whiteSpace="nowrap">
                <Text fontSize="16px" fontWeight="800">
                  {ars(o.total)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Text fontFamily="heading" fontSize="22px" textTransform="uppercase" mt="26px" mb="12px">
        Acciones rápidas
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap="10px">
        {quickActions.map((q) => (
          <Box
            key={q.label}
            as="button"
            onClick={q.onClick}
            textAlign="left"
            border="1px solid"
            borderColor="aoe.borderSubtle"
            bg="aoe.tile"
            borderRadius="16px"
            p={4}
            minH="92px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            color="aoe.text"
          >
            <Text fontFamily="heading" fontSize="20px" color="aoe.red">
              {q.icon}
            </Text>
            <Text fontSize="14px" fontWeight="700" lineHeight="1.25">
              {q.label}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
