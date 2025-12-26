"use client";

import { Card, Grid, Box, Field, Input, Heading } from "@chakra-ui/react";

interface ClientDataSectionProps {
  clientName?: string;
  phoneNumber?: string;
  email?: string;
}

export default function ClientDataSection({ clientName, phoneNumber, email }: ClientDataSectionProps) {
  return (
    <Card.Root variant="elevated">
      <Card.Header>
        <Heading size="md">Datos del Cliente</Heading>
      </Card.Header>
      <Card.Body>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <Box>
            <Field.Root>
              <Field.Label>Nombre del cliente</Field.Label>
              <Input
                name="clientName"
                placeholder="Ej. Juan Pérez"
                defaultValue={clientName}
                required
              />
            </Field.Root>
          </Box>
          <Box>
            <Field.Root>
              <Field.Label>Teléfono</Field.Label>
              <Input
                name="phoneNumber"
                placeholder="+54 9 11 ..."
                defaultValue={phoneNumber}
              />
            </Field.Root>
          </Box>
          <Box>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                name="email"
                placeholder="cliente@mail.com"
                defaultValue={email}
              />
            </Field.Root>
          </Box>
        </Grid>
      </Card.Body>
    </Card.Root>
  );
}
