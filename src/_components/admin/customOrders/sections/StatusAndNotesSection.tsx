"use client";

import {
  Card,
  Grid,
  Box,
  Field,
  Textarea,
  Heading,
  Select,
  Separator,
  Portal,
  createListCollection,
} from "@chakra-ui/react";

export default function StatusAndNotesSection({ status, setStatus, paymentStatus, setPaymentStatus }: any) {
  const statusOptions = createListCollection({
    items: [
      { label: "Pendiente", value: "pending" },
      { label: "En progreso", value: "in_progress" },
      { label: "Completada", value: "completed" },
      { label: "Cancelada", value: "cancelled" },
    ],
  });

  const paymentOptions = createListCollection({
    items: [
      { label: "Pendiente", value: "pending" },
      { label: "Pagado", value: "paid" },
      { label: "Reembolsado", value: "refunded" },
    ],
  });

  return (
    <Card.Root variant="elevated" mt={6}>
      <Card.Header>
        <Heading size="md">Estado y notas</Heading>
      </Card.Header>
      <Card.Body>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <Box>
            <Select.Root
              collection={statusOptions}
              value={status}
              onValueChange={(e) => setStatus(e.value)}
              width="full"
            >
              <Select.HiddenSelect name="status" />
              <Select.Label>Estado de la orden</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Seleccionar estado" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {statusOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
            </Select.Root>
          </Box>

          <Box>
            <Select.Root
              collection={paymentOptions}
              value={paymentStatus}
              onValueChange={(e) => setPaymentStatus(e.value)}
              width="full"
            >
              <Select.HiddenSelect name="paymentStatus" />
              <Select.Label>Estado de pago</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Seleccionar estado de pago" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {paymentOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
            </Select.Root>
          </Box>
        </Grid>

        <Separator my={4} />

        <Box>
          <Field.Root>
            <Field.Label>Comentarios</Field.Label>
            <Textarea placeholder="Comentarios adicionales..." name="comments" rows={3} />
          </Field.Root>
        </Box>

        <Box mt={3}>
          <Field.Root>
            <Field.Label>Notas de diseño</Field.Label>
            <Textarea placeholder="Detalles del diseño..." name="designNotes" rows={3} />
          </Field.Root>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
