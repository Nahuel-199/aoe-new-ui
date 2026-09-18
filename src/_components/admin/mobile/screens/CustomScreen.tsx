"use client";

import { Box, Flex, Grid, Link, Text } from "@chakra-ui/react";
import { CustomOrder } from "@/types/customOrder.types";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

const STATUS_LABELS: Record<CustomOrder["status"], string> = {
  pending: "Pendiente",
  in_progress: "En producción",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<CustomOrder["status"], string> = {
  pending: "#fbbf24",
  in_progress: "#a78bfa",
  completed: "#34d399",
  cancelled: "#e11d2e",
};

const NEXT_STATUS: Partial<Record<CustomOrder["status"], { next: CustomOrder["status"]; label: string }>> = {
  pending: { next: "in_progress", label: "Marcar en producción" },
  in_progress: { next: "completed", label: "Marcar completado" },
};

interface CustomScreenProps {
  customOrders: CustomOrder[];
  onCreate: () => void;
  onEdit: (order: CustomOrder) => void;
  onAdvance: (order: CustomOrder, next: CustomOrder["status"]) => void;
}

export default function CustomScreen({ customOrders, onCreate, onEdit, onAdvance }: CustomScreenProps) {
  return (
    <Box>
      <Box
        as="button"
        onClick={onCreate}
        w="full"
        h="50px"
        borderRadius="14px"
        border="1px dashed"
        borderColor="aoe.borderHover"
        bg="aoe.tile"
        color="aoe.text"
        fontSize="13px"
        fontWeight="700"
        letterSpacing="0.08em"
        textTransform="uppercase"
        _hover={{ borderColor: "aoe.red" }}
      >
        + Nuevo pedido personalizado
      </Box>

      <Box display="grid" gap="12px" mt="14px">
        {customOrders.map((c) => {
          const totalQty = c.items.reduce((acc, i) => acc + i.quantity, 0);
          const itemsLabel = c.items.length === 1 ? c.items[0].name : `${totalQty} unidades`;
          const paid = c.paidAmount ?? 0;
          const due = Math.max(0, c.total - paid);
          const pct = c.total > 0 ? Math.min(100, Math.round((paid / c.total) * 100)) : 0;
          const delivery = [c.deliveryMethod, c.shippingAddress || c.meetingAddress].filter(Boolean).join(" · ") || "Sin especificar";
          const advance = NEXT_STATUS[c.status];

          return (
            <Box key={c._id} border="1px solid" borderColor="aoe.borderSubtle" bg="aoe.tile" borderRadius="18px" p="16px">
              <Flex gap="10px" align="flex-start">
                <Box minW={0} flex={1}>
                  <Text fontSize="16px" fontWeight="700" color="aoe.text">
                    {c.clientName}
                  </Text>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" mt="4px">
                    {[c.phoneNumber, c.email].filter(Boolean).join(" · ")}
                  </Text>
                </Box>
                <Box
                  border="1px solid"
                  borderColor={STATUS_COLORS[c.status]}
                  color={STATUS_COLORS[c.status]}
                  borderRadius="pill"
                  px="10px"
                  py="4px"
                  fontFamily="mono"
                  fontSize="11px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  whiteSpace="nowrap"
                >
                  {STATUS_LABELS[c.status]}
                </Box>
              </Flex>

              <Box mt="16px">
                <Flex justify="space-between" fontFamily="mono" fontSize="11px" letterSpacing="0.1em" textTransform="uppercase" color="aoe.textSubtle">
                  <Text>Pagado {ars(paid)}</Text>
                  <Text>Resta {ars(due)}</Text>
                </Flex>
                <Box h="6px" borderRadius="pill" bg="aoe.borderSubtle" overflow="hidden" mt="8px">
                  <Box h="100%" borderRadius="pill" bg="aoe.green" width={`${pct}%`} />
                </Box>
              </Box>

              <Grid templateColumns="repeat(auto-fit, minmax(130px, 1fr))" gap="12px" mt="16px">
                <Box>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Items
                  </Text>
                  <Text fontSize="14px" fontWeight="600" mt="3px" color="aoe.text">
                    {itemsLabel}
                  </Text>
                </Box>
                <Box>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Total
                  </Text>
                  <Text fontSize="14px" fontWeight="800" mt="3px" color="aoe.text">
                    {ars(c.total)}
                  </Text>
                </Box>
                <Box>
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Entrega
                  </Text>
                  <Text fontSize="14px" fontWeight="600" mt="3px" color="aoe.text">
                    {delivery}
                  </Text>
                </Box>
              </Grid>

              {(c.comments || c.designNotes) && (
                <Text mt="14px" borderTop="1px solid" borderColor="aoe.borderSubtle" pt="12px" color="aoe.textSubtle" fontSize="13px" lineHeight="1.5">
                  {c.comments || c.designNotes}
                </Text>
              )}

              <Flex gap="8px" mt="14px">
                {advance && (
                  <Box
                    as="button"
                    onClick={() => onAdvance(c, advance.next)}
                    flex={1}
                    h="46px"
                    borderRadius="12px"
                    border="none"
                    bg="aoe.text"
                    color="aoe.bg"
                    fontSize="12px"
                    fontWeight="800"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                  >
                    {advance.label}
                  </Box>
                )}
                {c.phoneNumber && (
                  <Link
                    href={`https://wa.me/54${c.phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    w="46px"
                    h="46px"
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="aoe.borderControl"
                    bg="aoe.chip"
                    color="aoe.textMuted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    _hover={{ textDecoration: "none" }}
                  >
                    ✆
                  </Link>
                )}
                <Box
                  as="button"
                  onClick={() => onEdit(c)}
                  w="46px"
                  h="46px"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="aoe.borderControl"
                  bg="aoe.chip"
                  color="aoe.textMuted"
                  fontSize="14px"
                >
                  ✎
                </Box>
              </Flex>
            </Box>
          );
        })}

        {customOrders.length === 0 && (
          <Text color="aoe.textSubtle" fontSize="13px" textAlign="center" py={8}>
            Todavía no hay pedidos personalizados.
          </Text>
        )}
      </Box>
    </Box>
  );
}
