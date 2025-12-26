"use client";

import { createCustomOrder } from "@/lib/actions/customOrder.action";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useActionState, useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import ClientDataSection from "./sections/ClientDataSection";
import ProductDetailsSection from "./sections/ProductDetailsSection";
import TotalsAndDeliverySection from "./sections/TotalsAndDeliverySection";
import StatusAndNotesSection from "./sections/StatusAndNotesSection";

const initialState = { success: false, message: "" };

interface CustomOrderFormProps {
  onClose?: () => void;
}

export default function CustomOrderForm({ onClose }: CustomOrderFormProps) {
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

  // Handle success/error messages
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toaster.success({
          title: "¡Orden creada exitosamente!",
          description: state.message,
        });
        // Reset form only on success
        setItems([{ name: "", description: "", color: "", size: "", quantity: 1, price: 0 }]);
        setDeliveryCost(0);
        setPaidAmount(0);
        setTotal(0);
        setRemaining(0);
        setStatus([]);
        setPaymentStatus([]);
        setDeliveryMethod([]);

        // Close drawer after success
        if (onClose) {
          setTimeout(() => onClose(), 1000);
        }
      } else {
        toaster.error({
          title: "Error al crear la orden",
          description: state.message,
        });
        // Don't reset form on error - keep user data
      }
    }
  }, [state, onClose]);

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
