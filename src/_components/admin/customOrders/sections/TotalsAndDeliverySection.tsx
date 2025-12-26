"use client";

import { Card, Grid, Box, Field, Input, VStack, Heading, Select, Portal } from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";

export default function TotalsAndDeliverySection({
  deliveryMethod,
  setDeliveryMethod,
  deliveryCost,
  setDeliveryCost,
  paidAmount,
  setPaidAmount,
  total,
  remaining,
}: any) {
  const deliveryCollection = createListCollection({
    items: [
      { label: "Correo", value: "correo" },
      { label: "Punto de encuentro", value: "punto_encuentro" },
    ],
  });

  return (
    <Card.Root variant="elevated" mt={6}>
      <Card.Header>
        <Heading size="md">Totales y entrega</Heading>
      </Card.Header>
      <Card.Body>
        <VStack gap={6} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <Box>
              <Select.Root
                name="deliveryMethod"
                collection={deliveryCollection}
                defaultValue={deliveryMethod}
                width="full"
                onValueChange={(e) => setDeliveryMethod(e.value)}
              >
                <Select.Label>Método de envío</Select.Label>
                <Select.HiddenSelect name="deliveryMethod" />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Método de envío" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
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
              </Select.Root>
            </Box>

            {deliveryMethod === "correo" && (
              <Box>
                <Field.Root>
                  <Field.Label>Dirección de envío</Field.Label>
                  <Input type="text" name="shippingAddress" />
                </Field.Root>
              </Box>
            )}

            {deliveryMethod === "punto_encuentro" && (
              <Box>
                <Field.Root>
                  <Field.Label>Dirección de encuentro</Field.Label>
                  <Input type="text" name="meetingAddress" />
                </Field.Root>
              </Box>
            )}

            <Box>
              <Field.Root>
                <Field.Label>Costo de envío</Field.Label>
                <Input
                  type="number"
                  name="deliveryCost"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(+e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Field.Root>
            </Box>

            <Box>
              <Field.Root>
                <Field.Label>Monto pagado</Field.Label>
                <Input
                  type="number"
                  name="paidAmount"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(+e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Field.Root>
            </Box>

            <Box>
              <Field.Root>
                <Field.Label>Monto restante</Field.Label>
                <Input
                  type="number"
                  name="remainingAmount"
                  value={remaining}
                  min="0"
                  step="0.01"
                  readOnly
                />
              </Field.Root>
            </Box>

            <Box>
              <Field.Root>
                <Field.Label>Total</Field.Label>
                <Input
                  type="number"
                  name="total"
                  value={total}
                  min="0"
                  step="0.01"
                  required
                  readOnly
                />
              </Field.Root>
            </Box>
          </Grid>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
