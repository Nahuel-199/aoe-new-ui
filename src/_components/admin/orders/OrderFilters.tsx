"use client";

import {
  HStack,
  Input,
  Button,
  Portal,
  Select,
  createListCollection,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

interface OrderFiltersProps {
  onFilterChange: (filters: {
    search: string;
    paymentMethod: string;
    status: string;
  }) => void;
}

export default function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 Colección para métodos de pago
  const paymentMethods = createListCollection({
    items: [
      { label: "Efectivo", value: "efectivo" },
      { label: "Transferencia", value: "transferencia" },
      { label: "Tarjeta", value: "tarjeta" },
      { label: "Mercado Pago", value: "mercadopago" },
    ],
  });

  // 🔹 Colección para estado de orden
  const orderStatuses = createListCollection({
    items: [
      { label: "Pendiente", value: "pending" },
      { label: "Confirmada", value: "confirmed" },
      { label: "En camino", value: "shipped" },
      { label: "Entregada", value: "delivered" },
      { label: "Cancelada", value: "cancelled" },
    ],
  });

  const handleApplyFilters = () => {
    onFilterChange({ search, paymentMethod, status });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      onFilterChange({ search, paymentMethod, status });
    }, 300);

    return () => clearTimeout(delay);
  }, [search, paymentMethod, status]);

  const handleReset = () => {
    setSearch("");
    setPaymentMethod("");
    setStatus("");
    onFilterChange({ search: "", paymentMethod: "", status: "" });
  };

  return (
    <HStack wrap="wrap" gap={3} mb={4}>
      <InputGroup
        flex="1"
        w={{ base: "100%", md: "250px" }}
        startElement={<LuSearch />}
        mt={6}
      >
        <Input
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          
     
        />
      </InputGroup>
      <Select.Root
        collection={paymentMethods}
        value={paymentMethod ? [paymentMethod] : []}
        onValueChange={(e) => setPaymentMethod(e.value[0])}
        width={{ base: "100%", md: "220px" }}
      >
        <Select.HiddenSelect />
        <Select.Label>Método de pago</Select.Label>
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
              {paymentMethods.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      {/* 📦 Estado de la orden */}
      <Select.Root
        collection={orderStatuses}
        value={status ? [status] : []}
        onValueChange={(e) => setStatus(e.value[0])}
        width={{ base: "100%", md: "220px" }}
      >
        <Select.HiddenSelect />
        <Select.Label>Estado</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Estado de orden" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {orderStatuses.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Button variant="outline" onClick={handleReset} mt={6}>
        Limpiar
      </Button>
    </HStack>
  );
}
