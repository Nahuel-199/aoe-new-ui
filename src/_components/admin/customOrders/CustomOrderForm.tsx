"use client";

import { createCustomOrder, updateCustomOrder, getCustomOrderById } from "@/lib/actions/customOrder.action";
import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import { useActionState, useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { showToast } from "nextjs-toast-notify";
import { useRouter } from "next/navigation";
import ClientDataSection from "./sections/ClientDataSection";
import ProductDetailsSection from "./sections/ProductDetailsSection";
import TotalsAndDeliverySection from "./sections/TotalsAndDeliverySection";
import StatusAndNotesSection from "./sections/StatusAndNotesSection";

const initialState = { success: false, message: "" };

interface CustomOrderFormProps {
  onClose?: () => void;
  mode?: "create" | "edit";
  orderId?: string;
}

export default function CustomOrderForm({ onClose, mode = "create", orderId }: CustomOrderFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCustomOrder, initialState);
  const [isLoading, setIsLoading] = useState(mode === "edit" && !!orderId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [status, setStatus] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>([]);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [items, setItems] = useState([
    { name: "", description: "", color: "", size: "", quantity: 1, price: 0, images: [] },
  ]);

  // Client data states
  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [designNotes, setDesignNotes] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [meetingAddress, setMeetingAddress] = useState("");

  // Cargar datos cuando está en modo edición
  useEffect(() => {
    if (mode === "edit" && orderId) {
      setIsLoading(true);
      getCustomOrderById(orderId)
        .then((result) => {
          if (result.success && result.data) {
            const order = result.data;
            // Poblar el formulario con los datos de la orden
            setStatus([order.status || "pending"]);
            setPaymentStatus([order.paymentStatus || "pending"]);
            setDeliveryMethod([order.deliveryMethod || ""]);
            setDeliveryCost(order.deliveryCost || 0);
            setPaidAmount(order.paidAmount || 0);
            setTotal(order.total || 0);
            setRemaining(order.remainingAmount || 0);

            // Client data
            setClientName(order.clientName || "");
            setPhoneNumber(order.phoneNumber || "");
            setEmail(order.email || "");
            setComments(order.comments || "");
            setDesignNotes(order.designNotes || "");
            setShippingAddress(order.shippingAddress || "");
            setMeetingAddress(order.meetingAddress || "");

            if (order.items && order.items.length > 0) {
              // Ensure all items have images array
              setItems(order.items.map((item: any) => ({
                ...item,
                images: item.images || []
              })));
            }
          } else {
            showToast.error("Error al cargar la orden");
          }
        })
        .catch(() => {
          showToast.error("Error al cargar la orden");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [mode, orderId]);

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
        setItems([{ name: "", description: "", color: "", size: "", quantity: 1, price: 0, images: [] }]);
        setDeliveryCost(0);
        setPaidAmount(0);
        setTotal(0);
        setRemaining(0);
        setStatus([]);
        setPaymentStatus([]);
        setDeliveryMethod([]);
        setClientName("");
        setPhoneNumber("");
        setEmail("");
        setComments("");
        setDesignNotes("");
        setShippingAddress("");
        setMeetingAddress("");

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
      { name: "", description: "", color: "", size: "", quantity: 1, price: 0, images: [] },
    ]);
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      let result;
      if (mode === "edit" && orderId) {
        // Extraer datos del formData
        const data = {
          clientName: formData.get("clientName") as string,
          phoneNumber: formData.get("phoneNumber") as string,
          email: formData.get("email") as string,
          items,
          total,
          remainingAmount: remaining,
          paidAmount,
          deliveryCost,
          deliveryMethod: deliveryMethod[0] || "",
          shippingAddress: formData.get("shippingAddress") as string,
          meetingAddress: formData.get("meetingAddress") as string,
          status: (status[0] || "pending") as "pending" | "in_progress" | "completed" | "cancelled",
          paymentStatus: (paymentStatus[0] || "pending") as "pending" | "paid" | "refunded",
          comments: formData.get("comments") as string,
          designNotes: formData.get("designNotes") as string,
        };
        result = await updateCustomOrder(orderId, data);
      } else {
        result = await createCustomOrder(null, formData);
      }

      if (result.success) {
        showToast.success(mode === "edit" ? "Orden actualizada exitosamente" : "Orden creada exitosamente");
        router.refresh();
        if (onClose) {
          setTimeout(() => onClose(), 500);
        }
      } else {
        showToast.error(result.message || "Error al guardar la orden");
      }
    } catch (error) {
      showToast.error("Error al guardar la orden");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <Heading size="lg" mb={6}>
        {mode === "edit" ? "Editar Pedido Personalizado" : "Crear Pedido Personalizado"}
      </Heading>

      {isLoading ? (
        <Box textAlign="center" py={8}>
          <Text>Cargando orden...</Text>
        </Box>
      ) : (
        <VStack gap={6} align="stretch">
          <form onSubmit={handleSubmit}>
          <ClientDataSection
            clientName={clientName}
            phoneNumber={phoneNumber}
            email={email}
          />
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
            shippingAddress={shippingAddress}
            meetingAddress={meetingAddress}
          />
          <StatusAndNotesSection
            status={status}
            setStatus={setStatus}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
            comments={comments}
            designNotes={designNotes}
          />

          <Button
            colorPalette="red"
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            size="lg"
            mt={2}
            alignSelf="center"
          >
            {mode === "edit"
              ? (isSubmitting ? "Guardando..." : "Guardar cambios")
              : (isSubmitting ? "Creando..." : "Crear orden")
            }
          </Button>
        </form>
      </VStack>
      )}
    </Box>
  );
}
