"use client";

import { useState, useEffect } from "react";
import { Dialog, Portal, Input, Button, VStack, Field } from "@chakra-ui/react";
import { Subcategory } from "@/types/product.types";
import { createSubcategory, updateSubcategory } from "@/lib/actions/subcategory.actions";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface SubcategoryFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  subcategory?: Subcategory | null;
  onClose: () => void;
}

export default function SubcategoryFormModal({
  open,
  mode,
  subcategory,
  onClose,
}: SubcategoryFormModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && subcategory) {
      setName(subcategory.name);
    } else {
      setName("");
    }
  }, [mode, subcategory, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toaster.error({ title: "El nombre es requerido" });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "create") {
        await createSubcategory({ name });
        toaster.success({ title: "Subcategoría creada exitosamente" });
      } else if (subcategory) {
        await updateSubcategory(subcategory._id, { name });
        toaster.success({ title: "Subcategoría actualizada exitosamente" });
      }
      router.refresh();
      onClose();
    } catch (error) {
      toaster.error({
        title: mode === "create" ? "Error al crear subcategoría" : "Error al actualizar subcategoría",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "Crear Subcategoría" : "Editar Subcategoría"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4}>
                <Field.Root>
                  <Field.Label>Nombre</Field.Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la subcategoría"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorPalette="red"
                onClick={handleSubmit}
                loading={isLoading}
              >
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
