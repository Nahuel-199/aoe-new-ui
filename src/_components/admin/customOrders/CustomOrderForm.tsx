"use client";

import { createCustomOrder } from "@/lib/actions/customOrder.action";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useActionState, useEffect, useState } from "react";
import ClientDataSection from "./sections/ClientDataSection";
import ProductDetailsSection from "./sections/ProductDetailsSection";
import TotalsAndDeliverySection from "./sections/TotalsAndDeliverySection";
import StatusAndNotesSection from "./sections/StatusAndNotesSection";

const initialState = { message: "" };

export default function CustomOrderForm() {
  const [state, formAction, pending] = useActionState(createCustomOrder, initialState);

  const [status, setStatus] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>([]);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [items, setItems] = useState([
    { name: "", description: "", color: "", size: "", quantity: 1, price: 0 },
  ]);

  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalCalculated = subtotal + deliveryCost;
    const remainingCalculated = totalCalculated - paidAmount;
    setTotal(totalCalculated);
    setRemaining(remainingCalculated);
  }, [items, deliveryCost, paidAmount]);

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", color: "", size: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <Heading size="lg" mb={6}>
        Crear Pedido Personalizado
      </Heading>

      <VStack gap={6} align="stretch">
        <form action={formAction}>
          <ClientDataSection />
          <ProductDetailsSection
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            handleItemChange={handleItemChange}
          />
          <TotalsAndDeliverySection
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            deliveryCost={deliveryCost}
            setDeliveryCost={setDeliveryCost}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            total={total}
            remaining={remaining}
          />
          <StatusAndNotesSection
            status={status}
            setStatus={setStatus}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
          />

          <Button
            colorPalette="red"
            type="submit"
            disabled={pending}
            size="lg"
            mt={2}
            alignSelf="center"
          >
            {pending ? "Creando..." : "Crear orden"}
          </Button>
        </form>
      </VStack>
    </Box>
  );
}
