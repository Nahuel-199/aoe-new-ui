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
      <VStack align="stretch" gap={4} px={4} py={6}>
        {filteredOrders.map((order) => (
          <Box
            key={order._id}
            borderWidth="1px"
            borderRadius="lg"
            shadow="sm"
            p={4}
            bg="bg"
          >
            <HStack justify="space-between" align="center" mt={3}>
              <Text fontWeight="bold">Orden #{order._id}</Text>
              <HStack gap={2}>
                <Badge colorPalette={STATUS_COLORS[order.status]} mr={2}>
                  {STATUS_LABELS[order.status].toLowerCase().trim()}
                </Badge>
                <IconButton
                  aria-label="Editar orden"
                  size="sm"
                  variant="outline"
                  colorPalette="blue"
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  aria-label="Eliminar orden"
                  size="sm"
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
            </HStack>

            <Text fontSize="sm" color="gray">
              Usuario: {order.user.name} ({order.user.email})
            </Text>

            <VStack align="stretch" mt={2} gap={2}>
              {order.items.map((item, idx) => (
                <HStack key={`${item.product._id}-${idx}`} gap={3}>
                  {item.variant.imageUrl && (
                    <Image
                      src={item.variant.imageUrl}
                      alt={item.product.name}
                      boxSize="60px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                  <Box>
                    <Text fontWeight="medium">{item.product.name}</Text>
                    <Text fontSize="sm" color="gray">
                      {item.variant.type}, {item.variant.color},{" "}
                      {item.variant.size} × {item.variant.quantity}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
            <Box mt={3} p={3} borderWidth="1px" borderRadius="md" mb={4}>
              <Text fontSize="sm" color="gray" mb={2}>
                Método de pago: {order.paymentMethod || "No especificado"}
              </Text>
              <Text fontSize="sm" color="gray" mb={2}>
                Pagado: ${order.paidAmount} / Restante: ${order.total - order.paidAmount }
              </Text>
              <Text fontSize="sm" color="gray" mb={2}>
                Teléfono: {order.phoneNumber || "No informado"}
              </Text>
              <Text fontSize="sm" color="gray" mb={2}>
                Envío:{" "}
                {order.deliveryMethod === "correo"
                  ? "Correo"
                  : "Punto de encuentro"}
              </Text>
              {order.meetingAddress && (
                <Text fontSize="sm" color="gray" mb={2}>
                  Dirección encuentro: {order.meetingAddress}
                </Text>
              )}
              {order.comments && (
                <Text fontSize="sm" color="gray" mb={2}>
                  Comentarios: {order.comments}
                </Text>
              )}
            </Box>
            <HStack justify="space-between" mb={3}>
              <Text fontWeight="bold">Total: ${order.total}</Text>
            </HStack>
            <HStack>
              {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    colorPalette={STATUS_COLORS[status]}
                    variant={order.status === status ? "solid" : "outline"}
                    onClick={() => handleChangeStatus(order._id, status)}
                  >
                    {STATUS_LABELS[status].toLowerCase().trim()}
                  </Button>
                )
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </>
  );
}
