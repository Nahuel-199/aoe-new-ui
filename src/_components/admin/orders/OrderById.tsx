"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/types/order.types";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Select,
  Button,
  Image,
  Separator,
  Badge,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { updateOrderAdmin } from "@/lib/actions/order.actions";
import { useFormStatus } from "react-dom";

interface OrderProps {
  orders: Order;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

export default function OrderById({ orders }: OrderProps) {
  const { pending } = useFormStatus();
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>(
    orders.deliveryMethod ? [orders.deliveryMethod] : []
  );
  const [deliveryCost, setDeliveryCost] = useState(orders.deliveryCost || 0);
  const [paidAmount, setPaidAmount] = useState(orders.paidAmount || 0);
  const [total, setTotal] = useState(orders.total || 0);

  useEffect(() => {
    const itemsTotal = orders.items.reduce(
      (sum, item) => sum + item.variant.price * item.variant.quantity,
      0
    );

    const newTotal =
      deliveryMethod[0] === "correo"
        ? itemsTotal + Number(deliveryCost)
        : itemsTotal;

    setTotal(newTotal);
  }, [deliveryMethod, deliveryCost, orders.items]);

  const deliveryCollection = createListCollection({
    items: [
      { label: "Correo", value: "correo" },
      { label: "Punto de encuentro", value: "punto_encuentro" },
    ],
  });

  const paymentCollection = createListCollection({
    items: [
      { label: "Efectivo", value: "efectivo" },
      { label: "Transferencia", value: "transferencia" },
      { label: "Otro", value: "otro" },
    ],
  });

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Orden #{orders._id}
      </Text>

      <Box mb={4}>
        <Text fontWeight="bold">Usuario:</Text>
        <Text>
          {orders.user.name} ({orders.user.email})
        </Text>
        {orders.phoneNumber && <Text>Teléfono: {orders.phoneNumber}</Text>}
      </Box>

      <Separator mb={4} />

      <VStack align="stretch" gap={3}>
        <Text fontWeight="bold">Productos:</Text>
        {orders.items.map((item, idx) => (
          <HStack key={idx} gap={3}>
            {item.variant.imageUrl && (
              <Image
                src={item.variant.imageUrl}
                alt={item.product.name}
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
              />
            )}
            <VStack align="start">
              <Text fontWeight="medium">{item.product.name}</Text>
              <Text fontSize="sm" color="gray">
                {item.variant.type}, {item.variant.color}, {item.variant.size} ×{" "}
                {item.variant.quantity}
              </Text>
              <Text fontSize="sm" color="gray">
                Precio: ${item.variant.price}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      <Separator my={4} />

      <HStack justify="space-between">
        <Text fontWeight="bold">Total productos:</Text>
        <Text fontWeight="bold" color="red.500">
          $
          {orders.items.reduce(
            (sum, item) => sum + item.variant.price * item.variant.quantity,
            0
          )}
        </Text>
      </HStack>


      {deliveryMethod[0] === "correo" && (
        <>
          <HStack justify="space-between" mt={3}>
            <Text fontWeight="bold">Total (productos + envío):</Text>
            <Text fontWeight="bold" color="red.500">
              ${total}
            </Text>
          </HStack>
        </>
      )}

      <Separator my={4} />

      <form action={updateOrderAdmin}>
        <Input type="hidden" name="orderId" value={orders._id} />
        <VStack align="stretch" gap={3}>
          <Text fontWeight="bold">Estado:</Text>
          <Badge colorPalette={STATUS_COLORS[orders.status]} mr={2}>
            {orders.status.toUpperCase()}
          </Badge>

          <Text fontWeight="bold">
            Comentarios: {orders.comments || "Ninguno"}
          </Text>

          <Textarea name="comments" defaultValue={orders.comments || ""} />

          <Text fontWeight="bold">Método de envío:</Text>
          <Select.Root
            name="deliveryMethod"
            collection={deliveryCollection}
            defaultValue={deliveryMethod}
            width="200px"
            onValueChange={(e) => setDeliveryMethod(e.value)}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Método de envío" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {deliveryCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <HStack mt={4} align="center" gap={4}>
            <Box>
              <Text fontWeight="bold" mb={1}>
                Costo de envío:
              </Text>
              <Input
                type="number"
                name="deliveryCost"
                width="120px"
                value={deliveryCost}
                onChange={(e) => setDeliveryCost(Number(e.target.value))}
              />
              <input type="hidden" name="total" value={orders.total} />
            </Box>
          </HStack>

          <Text fontWeight="bold">Método de pago:</Text>
          <Select.Root
            name="paymentMethod"
            collection={paymentCollection}
            defaultValue={orders.paymentMethod ? [orders.paymentMethod] : []}
            width="200px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Método de pago" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {paymentCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <HStack gap={4}>
            <Box>
              <Text fontWeight="bold">Pagado:</Text>
              <Input
                type="number"
                name="paidAmount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Restante:</Text>
              <Input
                type="number"
                name="remainingAmount"
                value={Math.max(total - paidAmount, 0)}
                readOnly
              />
            </Box>
          </HStack>

          <Text fontWeight="bold">Número de teléfono:</Text>
          <Input name="phoneNumber" defaultValue={orders.phoneNumber || ""} />

          {orders.deliveryMethod === "punto_encuentro" && (
            <>
              <Text fontWeight="bold">Dirección del punto de encuentro:</Text>
              <Input
                name="meetingAddress"
                defaultValue={orders.meetingAddress || ""}
              />
            </>
          )}

          <Button colorScheme="blue" type="submit" mb={4} mt={4} loading={pending}>
            Guardar cambios
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
