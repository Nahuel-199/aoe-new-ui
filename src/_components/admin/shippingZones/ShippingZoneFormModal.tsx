"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  Portal,
  Input,
  Button,
  VStack,
  Field,
  Grid,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { ARGENTINE_PROVINCES } from "@/lib/constants/provinces";
import {
  createShippingZone,
  updateShippingZone,
} from "@/lib/actions/shippingZone.actions";
import { ShippingZone } from "@/types/shippingZone.types";

interface ShippingZoneFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  zone?: ShippingZone | null;
  onClose: () => void;
}

const EMPTY_FORM = {
  name: "",
  provinces: [] as string[],
  postalCodeFrom: "",
  postalCodeTo: "",
  cost: "",
};

export default function ShippingZoneFormModal({
  open,
  mode,
  zone,
  onClose,
}: ShippingZoneFormModalProps) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && zone) {
      setForm({
        name: zone.name,
        provinces: zone.provinces,
        postalCodeFrom: zone.postalCodeFrom?.toString() ?? "",
        postalCodeTo: zone.postalCodeTo?.toString() ?? "",
        cost: zone.cost.toString(),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [mode, zone, open]);

  const toggleProvince = (province: string) => {
    setForm((prev) => ({
      ...prev,
      provinces: prev.provinces.includes(province)
        ? prev.provinces.filter((p) => p !== province)
        : [...prev.provinces, province],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        name: form.name,
        provinces: form.provinces as ShippingZone["provinces"],
        postalCodeFrom: form.postalCodeFrom ? Number(form.postalCodeFrom) : undefined,
        postalCodeTo: form.postalCodeTo ? Number(form.postalCodeTo) : undefined,
        cost: Number(form.cost),
      };

      const result =
        mode === "create"
          ? await createShippingZone(payload)
          : await updateShippingZone(zone!._id, payload);

      if (!result.success) {
        toaster.error({ title: result.message });
        return;
      }

      toaster.success({ title: result.message });
      router.refresh();
      onClose();
    } catch {
      toaster.error({
        title: mode === "create" ? "Error al crear la zona" : "Error al actualizar la zona",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(details) => !details.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "Crear zona de envío" : "Editar zona de envío"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Field.Root required>
                  <Field.Label>Nombre</Field.Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: CABA, GBA, Interior"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Costo de envío</Field.Label>
                  <Input
                    type="number"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="0"
                  />
                </Field.Root>

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Field.Root>
                    <Field.Label>CP desde (opcional)</Field.Label>
                    <Input
                      type="number"
                      value={form.postalCodeFrom}
                      onChange={(e) => setForm({ ...form, postalCodeFrom: e.target.value })}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>CP hasta (opcional)</Field.Label>
                    <Input
                      type="number"
                      value={form.postalCodeTo}
                      onChange={(e) => setForm({ ...form, postalCodeTo: e.target.value })}
                    />
                  </Field.Root>
                </Grid>
                <Text fontSize="xs" color="gray.500">
                  Si definís un rango de CP, se usa primero. Las provincias son el criterio de
                  respaldo cuando el CP no cae en ningún rango.
                </Text>

                <Field.Root required>
                  <Field.Label>Provincias</Field.Label>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {ARGENTINE_PROVINCES.map((province) => (
                      <Box
                        key={province}
                        as="label"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontSize="sm"
                        cursor="pointer"
                        userSelect="none"
                      >
                        <input
                          type="checkbox"
                          checked={form.provinces.includes(province)}
                          onChange={() => toggleProvince(province)}
                          style={{ width: 16, height: 16, cursor: "pointer" }}
                        />
                        {province}
                      </Box>
                    ))}
                  </Grid>
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button colorPalette="red" onClick={handleSubmit} loading={isLoading}>
                {mode === "create" ? "Crear" : "Guardar"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
