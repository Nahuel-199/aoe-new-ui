"use client";

import React, { useState } from "react";
import { Order } from "@/types/order.types";
import {
  Box,
  VStack,
  Text,
  HStack,
  Badge,
  Image,
  Button,
  IconButton,
  Wrap,
  Stack,
} from "@chakra-ui/react";
import { deleteOrder, updateOrderStatus } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import OrderFilters from "./OrderFilters";

const STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  shipped: "En camino",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

export default function ListOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [localOrders, setLocalOrders] = useState(orders);
  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
    status: "",
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredOrders = localOrders.filter((order) => {
    const searchMatch =
      !filters.search ||
      order.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.user.email.toLowerCase().includes(filters.search.toLowerCase());

    const paymentMatch =
      !filters.paymentMethod || order.paymentMethod === filters.paymentMethod;

    const statusMatch = !filters.status || order.status === filters.status;

    return searchMatch && paymentMatch && statusMatch;
  });

  const handleChangeStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus as any);

      setLocalOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  return (
    <>
      <OrderFilters onFilterChange={handleFilterChange} />
      <VStack
        align="stretch"
        gap={4}
        px={{ base: 2, md: 4 }}
        py={{ base: 4, md: 6 }}
      >
        {filteredOrders.map((order) => (
          <Box
            key={order._id}
            borderWidth="1px"
            borderRadius="lg"
            shadow="sm"
            p={{ base: 3, md: 4 }}
            bg="bg"
          >
            <Stack
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              mt={3}
              gap={{ base: 2, sm: 0 }}
            >
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                Orden #{order._id}
              </Text>

              <HStack gap={2} align="center">
                <Badge colorPalette={STATUS_COLORS[order.status]} mr={1}>
                  {STATUS_LABELS[order.status].toLowerCase().trim()}
                </Badge>

                <IconButton
                  aria-label="Editar orden"
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorPalette="blue"
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                >
                  <FaEdit />
                </IconButton>

                <IconButton
                  aria-label="Eliminar orden"
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorPalette="red"
                  onClick={async () => {
                    try {
                      await deleteOrder(order._id);
                      setLocalOrders((prev: any) =>
                        prev.filter((o: any) => o._id !== order._id)
                      );
                    } catch (err) {
                      console.error("Error eliminando orden:", err);
                    }
                  }}
                >
                  <FaTrash />
                </IconButton>
              </HStack>
            </Stack>

            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
              Usuario: {order.user.name} ({order.user.email})
            </Text>

            <VStack align="stretch" mt={3} gap={2}>
              {order.items.map((item, idx) => (
                <Stack
                  key={`${item.product._id}-${idx}`}
                  direction={{ base: "column", sm: "row" }}
                  align="center"
                  gap={3}
                >
                  {item.variant.imageUrl && (
                    <Image
                      src={item.variant.imageUrl}
                      alt={item.product.name}
                      boxSize={{ base: "50px", md: "60px" }}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                  <Box textAlign={{ base: "center", sm: "left" }}>
                    <Text
                      fontWeight="medium"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {item.product.name}
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                      {item.variant.type}, {item.variant.color},{" "}
                      {item.variant.size} × {item.variant.quantity}
                    </Text>
                  </Box>
                </Stack>
              ))}
            </VStack>

            <Box
              mt={3}
              p={{ base: 2, md: 3 }}
              borderWidth="1px"
              borderRadius="md"
              mb={4}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={1}>
                Método de pago: {order.paymentMethod || "No especificado"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={1}>
                Pagado: ${order.paidAmount} / Restante: $
                {order.total - order.paidAmount}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={1}>
                Teléfono: {order.phoneNumber || "No informado"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={1}>
                Envío:{" "}
                {order.deliveryMethod === "correo"
                  ? "Correo"
                  : "Punto de encuentro"}
              </Text>

              {order.meetingAddress && (
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  mb={1}
                >
                  Dirección encuentro: {order.meetingAddress}
                </Text>
              )}
              {order.comments && (
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.500"
                  mb={1}
                >
                  Comentarios: {order.comments}
                </Text>
              )}
            </Box>

            <HStack justify="space-between" mb={3}>
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                Total: ${order.total}
              </Text>
            </HStack>

            <Wrap gap={2}>
              {[
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <Button
                  key={status}
                  size={{ base: "xs", md: "sm" }}
                  colorPalette={STATUS_COLORS[status]}
                  variant={order.status === status ? "solid" : "outline"}
                  onClick={() => handleChangeStatus(order._id, status)}
                >
                  {STATUS_LABELS[status].toLowerCase().trim()}
                </Button>
              ))}
            </Wrap>
          </Box>
        ))}
      </VStack>
    </>
  );
}
