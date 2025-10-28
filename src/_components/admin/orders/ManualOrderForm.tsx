"use client";

import {
  Box,
  VStack,
  Heading,
  Input,
  Textarea,
  Text,
  HStack,
  Image,
  IconButton,
  Button,
  Separator,
  Progress,
  Portal,
  createListCollection,
  Select,
  Field,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";
import { createManualOrder } from "@/lib/actions/order.actions";
import { useManualOrderForm } from "@/hooks/useManualOrderForm";

export default function ManualOrderForm() {
  const {
    items,
    isUploadingImage,
    addItem,
    handleChange,
    handleUploadImage,
    handleRemoveImage,
  } = useManualOrderForm();

  const [paidAmount, setPaidAmount] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const newTotal =
      items.reduce(
        (sum: number, i: { price: number; quantity: number }) =>
          sum + i.price * i.quantity,
        0
      ) + deliveryCost;
    setTotal(newTotal);
  }, [items, deliveryCost]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      interface Item {
        name: string;
        description: string;
        images: string[];
        color: string;
        size: string;
        price: number;
        quantity: number;
      }

      interface FormDataType {
        shippingAddress: string;
        deliveryMethod: string;
        deliveryCost: number;
        paymentMethod: string;
        paidAmount: number;
        phoneNumber: string;
        meetingAddress: string;
        notes: string;
        items: Item[];
      }

      const data: FormDataType = {
        shippingAddress: formData.get("shippingAddress") as string,
        deliveryMethod: formData.getAll("deliveryMethod")[0] as string,
        deliveryCost: Number(formData.get("deliveryCost")),
        paymentMethod: formData.getAll("paymentMethod")[0] as string,
        paidAmount: Number(formData.get("paidAmount")),
        phoneNumber: formData.get("phoneNumber") as string,
        meetingAddress: formData.get("meetingAddress") as string,
        notes: formData.get("notes") as string,
        items: items.map((i: any) => ({
          name: i.name,
          description: i.description,
          images: i.images.map((img: any) => img.url),
          color: i.color,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      await createManualOrder({
        ...data,
        total,
        remainingAmount: Math.max(total - data.paidAmount, 0),
      });

      toaster.success({
        title: "Orden personalizada creada correctamente",
        duration: 3000,
      });
    } catch (err: any) {
      toaster.error({
        title: "Error creando orden",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" bg="bg" p={6} rounded="lg" shadow="sm">
      <Heading size="md" mb={4}>
        Crear Orden Personalizada
      </Heading>

      <form onSubmit={handleCreate}>
        <VStack align="stretch" gap={6}>
          {items.map((item: any, index: any) => (
            <Box key={index} p={4} bg="bg">
              <Heading size="sm" mb={4}>
                Producto #{index + 1}
              </Heading>

              <VStack align="stretch" gap={3}>
                <Field.Root>
                  <Field.Label>Nombre del producto</Field.Label>
                <Input
                  placeholder="Nombre del producto"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Descripción del producto</Field.Label>
                <Textarea
                  placeholder="Descripción del producto"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                />
                </Field.Root>

                {isUploadingImage ? (
                  <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    p={4}
                    bg="gray.50"
                  >
                    <Text mb={2} fontSize="sm" color="gray.600">
                      Subiendo imágenes...
                    </Text>
                    <Progress.Root
                      value={60}
                      colorPalette="red"
                      variant="subtle"
                      width="100%"
                    >
                      <Progress.Track>
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>
                ) : (
                  <Field.Root>
                  <Field.Label>Imágenes del producto</Field.Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      handleUploadImage(index, files);
                    }}
                  />
                  </Field.Root>
                )}

                <HStack wrap="wrap" gap={3}>
                  {item.images.map(
                    (img: { id: string; url: string }, imgIndex: number) => (
                      <Box key={img.id} position="relative">
                        <Image
                          src={img.url}
                          alt="preview"
                          boxSize="100px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <IconButton
                          aria-label="Eliminar"
                          size="xs"
                          position="absolute"
                          top="2px"
                          right="2px"
                          onClick={() => handleRemoveImage(index, imgIndex)}
                        >
                          <IoClose />
                        </IconButton>
                      </Box>
                    )
                  )}
                </HStack>

                <HStack>
                  <Field.Root>
                  <Field.Label>Color</Field.Label>
                  <Input
                    placeholder="Color"
                    value={item.color}
                    onChange={(e) =>
                      handleChange(index, "color", e.target.value)
                    }
                    />
                    </Field.Root>
                    <Field.Root>
                  <Field.Label>Talle</Field.Label>
                  <Input
                    placeholder="Talle"
                    value={item.size}
                    onChange={(e) =>
                      handleChange(index, "size", e.target.value)
                    }
                    />
                    </Field.Root>
                </HStack>

                <HStack>
                  <Field.Root>
                  <Field.Label>Precio</Field.Label>
                  <Input
                    type="number"
                    placeholder="Precio"
                    value={item.price}
                    onChange={(e) =>
                      handleChange(index, "price", parseFloat(e.target.value))
                    }
                  />
                    </Field.Root>
                    <Field.Root>
                  <Field.Label>Cantidad</Field.Label>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", parseInt(e.target.value))
                    }
                    />
                    </Field.Root>
                </HStack>
              </VStack>
            </Box>
          ))}

          <Button onClick={addItem} colorScheme="blue" variant="outline">
            + Agregar otro producto
          </Button>

          <Separator />

          {/* Datos generales */}
          <Field.Root>
            <Field.Label>Dirección de envío</Field.Label>
          <Input placeholder="Dirección de envío" name="shippingAddress" />
          </Field.Root>

          <Select.Root
            name="deliveryMethod"
            collection={deliveryCollection}
            width="200px"
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
            </Box>
          </HStack>

          <Text fontWeight="bold">Método de pago:</Text>
          <Select.Root
            name="paymentMethod"
            collection={paymentCollection}
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

          <Input placeholder="Número de teléfono" name="phoneNumber" />
          <Input
            placeholder="Dirección del punto de encuentro"
            name="meetingAddress"
          />
          <Textarea placeholder="Notas adicionales" name="notes" />

          <Button colorScheme="green" type="submit" loading={loading}>
            Crear Orden Personalizada
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
