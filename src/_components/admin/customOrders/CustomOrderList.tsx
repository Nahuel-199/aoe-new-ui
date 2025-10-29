"use client";

import React from "react";
import { Box, Card, Text, Stack, Badge, HStack, Flex, IconButton, Heading } from "@chakra-ui/react";
import { CustomOrder } from "@/types/customOrder.types";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface CustomOrderListProps {
  orders: CustomOrder[];
}

export default function CustomOrderList({ orders }: CustomOrderListProps) {
  const router = useRouter();
  if (!orders || orders.length === 0) {
    return <Text>No hay órdenes personalizadas registradas.</Text>;
  }

  return (
    <Stack gap={4}>
      <Flex mb={4}>
        <IconButton
          aria-label="Agregar orden de compra"
          variant="outline"
          colorPalette="red"
          onClick={() => router.push("/admin/custom-orders/new")}
          size={"sm"}
          rounded={"full"}
        >
          <FiPlus />
        </IconButton>
        <Heading size="2xl" ml={2}>
          Personalizados
        </Heading>
      </Flex>
      {orders.map((order) => (
        <Card.Root key={order._id} p={4} shadow="md" borderWidth="1px">
          <HStack justify="space-between" align="start">
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {order.clientName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {order.email || "Sin email"} —{" "}
                {order.phoneNumber || "Sin teléfono"}
              </Text>
            </Box>

            <Badge
              colorPalette={
                order.status === "completed"
                  ? "green"
                  : order.status === "in_progress"
                  ? "yellow"
                  : order.status === "cancelled"
                  ? "red"
                  : "gray"
              }
            >
              {order.status}
            </Badge>
          </HStack>

          <Text mt={2}>Total: ${order.total}</Text>
          <Text>Monto pagado: ${order.paidAmount || 0}</Text>
          <Text>Monto restante: ${order.remainingAmount || 0}</Text>
          <Text fontSize="sm" color="gray.400">
            Creada el {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </Card.Root>
      ))}
    </Stack>
  );
}
