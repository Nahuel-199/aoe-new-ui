"use client";

import { Box, Text } from "@chakra-ui/react";

export type DeliveryMethod = "correo" | "punto_encuentro";

interface DeliveryMethodSelectorProps {
  value: DeliveryMethod;
  onChange: (value: DeliveryMethod) => void;
}

const OPTIONS: { value: DeliveryMethod; label: string; description: string }[] = [
  {
    value: "correo",
    label: "Envío a domicilio",
    description: "Lo enviamos por Correo Argentino a la dirección que nos indiques.",
  },
  {
    value: "punto_encuentro",
    label: "Punto de encuentro",
    description: "Coordinamos un lugar y horario para entregarte el pedido en persona.",
  },
];

export default function DeliveryMethodSelector({
  value,
  onChange,
}: DeliveryMethodSelectorProps) {
  return (
    <Box display="grid" gap={3}>
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <Box
            key={opt.value}
            as="button"
            onClick={() => onChange(opt.value)}
            textAlign="left"
            p={4}
            borderRadius="10px"
            border="1px solid"
            borderColor={active ? "aoe.red" : "aoe.borderSubtle"}
            bg={active ? "aoe.surface" : "transparent"}
            cursor="pointer"
          >
            <Text fontWeight="700" color="aoe.text" fontSize="sm">
              {opt.label}
            </Text>
            <Text fontSize="xs" color="aoe.textSubtle" mt={1}>
              {opt.description}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
