"use client";

import React, { useState } from "react";
import { Box, Card, Text, Stack, Badge, HStack, Flex, IconButton, Heading, Grid, Separator } from "@chakra-ui/react";
import { CustomOrder } from "@/types/customOrder.types";
import { FiPlus, FiUser, FiMail, FiPhone, FiPackage, FiTruck, FiDollarSign, FiCalendar, FiFileText, FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteCustomOrder } from "@/lib/actions/customOrder.action";
import { showToast } from "nextjs-toast-notify";
import { useRouter } from "next/navigation";

interface CustomOrderListProps {
  orders: CustomOrder[];
  onOpenDrawer: (mode?: "create" | "edit", orderId?: string) => void;
}

export default function CustomOrderList({ orders, onOpenDrawer }: CustomOrderListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la orden de ${clientName}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteCustomOrder(id);

      if (result.success) {
        showToast.success("Orden eliminada correctamente");
        router.refresh();
      } else {
        showToast.error(result.message || "Error al eliminar la orden");
      }
    } catch (error) {
      showToast.error("Error al eliminar la orden");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Stack gap={4}>
      <Flex mb={4}>
        <IconButton
          aria-label="Agregar orden de compra"
          variant="outline"
          colorPalette="red"
          onClick={() => onOpenDrawer()}
          size={"sm"}
          rounded={"full"}
        >
          <FiPlus />
        </IconButton>
        <Heading size="2xl" ml={2}>
          Personalizados
        </Heading>
      </Flex>

      {(!orders || orders.length === 0) && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No hay órdenes personalizadas registradas.</Text>
        </Box>
      )}
      {orders && orders.map((order) => {
        const getStatusLabel = (status: string) => {
          switch (status) {
            case "completed": return "Completado";
            case "in_progress": return "En proceso";
            case "cancelled": return "Cancelado";
            default: return "Pendiente";
          }
        };

        const getPaymentStatusLabel = (status: string) => {
          switch (status) {
            case "paid": return "Pagado";
            case "refunded": return "Reembolsado";
            default: return "Pendiente";
          }
        };

        return (
          <Card.Root key={order._id} shadow="sm" borderWidth="1px" overflow="hidden">
            {/* Header con estado */}
            <Box bg="bg" px={4} py={3} borderBottomWidth="1px">
              <Flex
                direction={{ base: "column", md: "row" }}
                justify={{ base: "flex-start", md: "space-between" }}
                align={{ base: "flex-start", md: "center" }}
                gap={3}
              >
                {/* Nombre del cliente */}
                <HStack gap={2} flex={{ base: "auto", md: 1 }}>
                  <FiUser />
                  <Text fontWeight="semibold" fontSize="md">
                    {order.clientName}
                  </Text>
                </HStack>

                {/* Badges y botones */}
                <Flex
                  gap={2}
                  flexWrap="wrap"
                  align="center"
                  w={{ base: "full", md: "auto" }}
                  justify={{ base: "space-between", md: "flex-end" }}
                >
                  {/* Badges */}
                  <HStack gap={2} flexWrap="wrap">
                    <Badge
                      size="sm"
                      colorPalette={
                        order.status === "completed"
                          ? "green"
                          : order.status === "in_progress"
                          ? "blue"
                          : order.status === "cancelled"
                          ? "red"
                          : "gray"
                      }
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Badge
                      size="sm"
                      colorPalette={order.paymentStatus === "paid" ? "green" : "orange"}
                    >
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </HStack>

                  {/* Botones de acción */}
                  <HStack gap={1}>
                    <IconButton
                      aria-label="Editar orden"
                      size="xs"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => onOpenDrawer("edit", order._id)}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      aria-label="Eliminar orden"
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleDelete(order._id, order.clientName)}
                      loading={deletingId === order._id}
                      disabled={deletingId === order._id}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </HStack>
                </Flex>
              </Flex>
            </Box>

            {/* Contenido principal */}
            <Box p={4}>
              {/* Información de contacto */}
              <Stack gap={2} mb={3}>
                {order.email && (
                  <HStack gap={2} fontSize="sm" color="gray.600">
                    <FiMail size={14} />
                    <Text>{order.email}</Text>
                  </HStack>
                )}
                {order.phoneNumber && (
                  <HStack gap={2} fontSize="sm" color="gray.600">
                    <FiPhone size={14} />
                    <Text>{order.phoneNumber}</Text>
                  </HStack>
                )}
              </Stack>

              <Separator my={3} />

              {/* Grid de información */}
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3} mb={3}>
                {/* Items */}
                <Box>
                  <HStack gap={2} mb={1}>
                    <FiPackage size={14} color="gray" />
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      ITEMS
                    </Text>
                  </HStack>
                  <Text fontSize="md" fontWeight="semibold">
                    {order.items?.length || 0} producto(s)
                  </Text>
                </Box>

                {/* Total */}
                <Box>
                  <HStack gap={2} mb={1}>
                    <FiDollarSign size={14} color="gray" />
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      TOTAL
                    </Text>
                  </HStack>
                  <Text fontSize="md" fontWeight="semibold" color="green.600">
                    ${order.total || "0"}
                  </Text>
                </Box>

                {/* Pagado */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                    PAGADO
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    ${order.paidAmount || "0"}
                  </Text>
                </Box>

                {/* Restante */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                    RESTANTE
                  </Text>
                  <Text fontSize="sm" color={order.remainingAmount ?? 0 > 0 ? "orange.600" : "green.600"}>
                    ${order.remainingAmount || "0"}
                  </Text>
                </Box>
              </Grid>

              {/* Método de entrega */}
              {order.deliveryMethod && (
                <>
                  <Separator my={3} />
                  <HStack gap={2} fontSize="sm">
                    <FiTruck size={14} color="gray" />
                    <Text color="gray.600">
                      <Text as="span" fontWeight="medium">Entrega:</Text> {order.deliveryMethod}
                    </Text>
                  </HStack>
                  {order.shippingAddress && (
                    <Text fontSize="sm" color="gray.500" ml={6}>
                      {order.shippingAddress}
                    </Text>
                  )}
                </>
              )}

              {/* Comentarios */}
              {order.comments && (
                <>
                  <Separator my={3} />
                  <HStack gap={2} align="start" fontSize="sm">
                    <FiFileText size={14} color="gray" style={{ marginTop: "2px" }} />
                    <Box>
                      <Text fontWeight="medium" color="gray.600" mb={1}>
                        Comentarios:
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        {order.comments}
                      </Text>
                    </Box>
                  </HStack>
                </>
              )}

              {/* Fecha */}
              <Separator my={3} />
              <HStack gap={2} fontSize="xs" color="gray.400">
                <FiCalendar size={12} />
                <Text>
                  Creada el {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </Text>
              </HStack>
            </Box>
          </Card.Root>
        );
      })}
    </Stack>
  );
}
